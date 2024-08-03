'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { PostArticle, PostArticleBase, ShortsArticle, ShortsArticleBase } from '@baik/types';
import { parseDateTime } from '@internationalized/date';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { DateValue } from '@nextui-org/react';
import dayjs from 'dayjs';

import api from '@/api';
import useArticles from '@/hooks/useArticles';
import { containsSpecialCharacters, isKebabCase } from '@/utils';

interface UseArticleWriteProps {
  article?: PostArticle | ShortsArticle | null;
}

interface FieldErrors {
  [key: string]: { message: string };
}

const ERROR_MESSAGES = {
  TITLE_REQUIRED: '제목을 입력하세요',
  TYPE_REQUIRED: '타입을 선택하세요',
  STATUS_REQUIRED: '상태를 선택하세요',
  PATHNAME_REQUIRED: '경로를 입력하세요',
  PATHNAME_INVALID_FORMAT: '형식이 올바르지 않습니다',
  PATHNAME_EXISTS: '이미 존재하는 경로입니다',
  PUBLISHED_DATE_REQUIRED: '게시일을 입력하세요',
  UPDATED_DATE_INVALID: '수정일은 게시일보다 이전일 수 없습니다',
  THUMBNAIL_URL_INVALID: 'URL 형식이 올바르지 않습니다',
};

const useArticleWrite = (props?: UseArticleWriteProps) => {
  const { query } = useArticles({ enabled: false });
  const { article: articleProp = null } = props ?? {};

  const router = useRouter();
  const searchParams = useSearchParams();

  const [article, setArticle] = useState(articleProp);
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<'post' | 'shorts'>('post');
  const [status, setStatus] = useState<'published' | 'private' | 'draft'>('draft');
  const [pathname, setPathname] = useState<string>('');
  const [publishedDate, setPublishedDate] = useState<DateValue | null>(null);
  const [updatedDate, setUpdatedDate] = useState<DateValue | null>(null);
  const [keywords, setKeywords] = useState<string>('');
  const [thumbnailImgUrl, setThumbnailImgUrl] = useState<string>('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [description, setDescription] = useState<string>('');

  const [enContentEnabled, setEnContentEnabled] = useState(false);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const translate = useCallback(async (): Promise<{
    title: string;
    content: string;
    description?: string;
  } | null> => {
    const translateText = async (text: string): Promise<string | undefined> => {
      const response = await api.client.utils.translate({ text });
      return response.data?.success ? response.data.item : undefined;
    };

    const [translatedTitle, translatedDescription, translatedContent] = await Promise.all([
      translateText(title),
      description ? translateText(description) : undefined,
      editorRef.current?.getMarkdown() ? translateText(editorRef.current.getMarkdown()) : undefined,
    ]);

    if (!translatedTitle || !translatedContent) return null;

    return {
      title: translatedTitle,
      description: translatedDescription,
      content: translatedContent,
    };
  }, [title, description]);

  const removeError = useCallback((key: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  const resetContents = useCallback(() => {
    setTitle('');
    setType('post');
    setStatus('draft');
    setPathname('');
    setPublishedDate(parseDateTime(dayjs().format('YYYY-MM-DDTHH:mm:ss')));
    setUpdatedDate(null);
    setKeywords('');
    setThumbnailImgUrl('');
    setDescription('');

    editorRef.current?.setMarkdown('');
  }, []);

  const getCurrentContents = useCallback(() => {
    const content = editorRef.current?.getMarkdown() ?? '';

    const publishedDateTimestamp = publishedDate ? Number(dayjs(publishedDate.toString()).toDate()) : 0;
    const updatedDateTimestamp = updatedDate ? Number(dayjs(updatedDate.toString()).toDate()) : publishedDateTimestamp;

    const updateData: Partial<PostArticleBase | ShortsArticleBase> = {
      title: title,
      type: type,
      status: status,
      content: content,
      pathname: pathname,
      published_date: publishedDateTimestamp,
      updated_date: updatedDateTimestamp,
    };

    if (description) updateData.description = description;
    if (keywords) updateData.keywords = keywords;
    if (thumbnailImgUrl) updateData.thumbnail_img_url = thumbnailImgUrl;

    return updateData;
  }, [title, type, status, pathname, publishedDate, updatedDate, keywords, thumbnailImgUrl, description]);

  const checkValues = useCallback(async () => {
    const newErrors: FieldErrors = {};

    const addError = (field: string, condition: boolean, message: string) => {
      if (condition) newErrors[field] = { message };
    };

    // 제목 검사
    addError('title', !title.trim(), ERROR_MESSAGES.TITLE_REQUIRED);

    // 타입 검사
    addError('type', !type, ERROR_MESSAGES.TYPE_REQUIRED);

    // 상태 검사
    addError('status', !status, ERROR_MESSAGES.STATUS_REQUIRED);

    // 경로 검사
    if (!pathname.trim()) {
      addError('pathname', true, ERROR_MESSAGES.PATHNAME_REQUIRED);
    } else if (!isKebabCase(pathname) || containsSpecialCharacters(pathname, ['-'])) {
      addError('pathname', true, ERROR_MESSAGES.PATHNAME_INVALID_FORMAT);
    } else {
      const res = await api.client.archive.getArticleByPathname({ pathname });
      const item = res.data?.item;
      addError('pathname', item && (!article || item.id !== article.id), ERROR_MESSAGES.PATHNAME_EXISTS);
    }

    // 게시일 검사
    addError('publishedDate', !publishedDate, ERROR_MESSAGES.PUBLISHED_DATE_REQUIRED);

    // 수정일 검사
    if (publishedDate && updatedDate) {
      const publishedDateNumber = Number(dayjs(publishedDate.toString()).toDate());
      const updatedDateNumber = Number(dayjs(updatedDate.toString()).toDate());
      addError('updatedDate', publishedDateNumber > updatedDateNumber, ERROR_MESSAGES.UPDATED_DATE_INVALID);
    }

    // 썸네일 URL 검사
    if (thumbnailImgUrl) {
      try {
        new URL(thumbnailImgUrl);
      } catch (e) {
        addError('thumbnailImgUrl', true, ERROR_MESSAGES.THUMBNAIL_URL_INVALID);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, type, status, pathname, publishedDate, updatedDate, thumbnailImgUrl, article]);

  const createArticle = useCallback(async () => {
    setSubmitLoading(true);

    const checked = await checkValues();
    if (!checked) {
      setSubmitLoading(false);
      return;
    }

    const newData = getCurrentContents();

    if (enContentEnabled) {
      const translateData = await translate();
      if (translateData) newData.intl = { en: translateData };
    }

    const res = await api.client.archive.createArticle(newData as PostArticle | ShortsArticle);
    if (res.data?.success) {
      router.replace(`/archive/write?pathname=${res.data.item.pathname}`);
      query.refetch();
    }

    setSubmitLoading(false);
  }, [checkValues, getCurrentContents, router]);

  const updateArticle = useCallback(async () => {
    setSubmitLoading(true);

    const checked = await checkValues();
    if (!checked || !article) {
      setSubmitLoading(false);
      return;
    }

    const updateContents = getCurrentContents();

    const updateData = { id: article.id, ...updateContents };

    if (enContentEnabled) {
      const translateData = await translate();
      if (translateData) updateData.intl = { en: translateData };
    } else {
      updateData.intl = null;
    }

    const res = await api.client.archive.updateArticle(updateData);

    if (res.data?.success) {
      setArticle(res.data.item);
      query.refetch();
    }

    setSubmitLoading(false);
  }, [article, checkValues, getCurrentContents, enContentEnabled, translate]);

  const setArticleContents = useCallback((article: PostArticle | ShortsArticle) => {
    setFetchLoading(true);

    if (article) {
      setTitle(article.title);
      setType(article.type);
      setStatus(article.status);
      setPathname(article.pathname);
      setPublishedDate(parseDateTime(dayjs(article.published_date).format('YYYY-MM-DDTHH:mm:ss')));
      setUpdatedDate(parseDateTime(dayjs(article.updated_date).format('YYYY-MM-DDTHH:mm:ss')));
      setKeywords(article.keywords ?? '');
      setThumbnailImgUrl(article.thumbnail_img_url ?? '');
      setDescription(article.description ?? '');

      setEnContentEnabled(!!article.intl?.en);

      editorRef.current?.setMarkdown(article.content);
    } else {
      setPublishedDate(parseDateTime(dayjs().format('YYYY-MM-DDTHH:mm:ss')));
    }

    setFetchLoading(false);
  }, []);

  const handlePathnameChanged = useCallback(
    async (pathnameSearchParam?: string | null) => {
      setFetchLoading(true);

      if (pathnameSearchParam) {
        const res = await api.client.archive.getArticleByPathname({ pathname: pathnameSearchParam });
        const item = res.data?.item;
        if (item) {
          setArticle(item);
        } else {
          router.replace('/archive/write');
        }
      } else {
        setArticle(null);
      }

      setFetchLoading(false);
    },
    [router],
  );

  const handleChangedArticle = useCallback(
    (changedArticle: PostArticle | ShortsArticle | null) => {
      if (changedArticle) setArticleContents(changedArticle);
      else resetContents();
    },
    [setArticleContents, resetContents],
  );

  useEffect(() => {
    handleChangedArticle(article);
  }, [article, handleChangedArticle]);

  useEffect(() => {
    const pathnameSearchParam = searchParams.get('pathname');
    handlePathnameChanged(pathnameSearchParam);
  }, [searchParams, handlePathnameChanged]);

  const memoizedValue = useMemo(
    () => ({
      editorRef,
      article,
      setArticle,
      title,
      setTitle,
      type,
      setType,
      status,
      setStatus,
      pathname,
      setPathname,
      publishedDate,
      setPublishedDate,
      updatedDate,
      setUpdatedDate,
      keywords,
      setKeywords,
      thumbnailImgUrl,
      setThumbnailImgUrl,
      errors,
      setErrors,
      fetchLoading,
      setFetchLoading,
      submitLoading,
      setSubmitLoading,
      removeError,
      createArticle,
      updateArticle,
      getCurrentContents,
      enContentEnabled,
      setEnContentEnabled,
      description,
      setDescription,
    }),
    [
      article,
      title,
      type,
      status,
      pathname,
      publishedDate,
      updatedDate,
      keywords,
      thumbnailImgUrl,
      errors,
      fetchLoading,
      submitLoading,
      removeError,
      createArticle,
      updateArticle,
      getCurrentContents,
      enContentEnabled,
      description,
    ],
  );

  return memoizedValue;
};

export default useArticleWrite;
