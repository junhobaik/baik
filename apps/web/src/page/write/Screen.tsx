'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { PostArticle, PostArticleBase, ShortsArticle, ShortsArticleBase } from '@baik/types';
import { parseDateTime } from '@internationalized/date';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { Button, DateInput, DateValue, Input, Select, SelectItem, Spinner } from '@nextui-org/react';
import dayjs from 'dayjs';
import styled from 'styled-components';

import api from '@/api';
import MDEditor from '@/components/MDEditor';
import { containsSpecialCharacters, isKebabCase } from '@/utils';

interface Errors {
  [key: string]: { message: string };
}

const WriteScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [article, setArticle] = useState<PostArticle | ShortsArticle | null>(null);

  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<'post' | 'shorts'>('post');
  const [status, setStatus] = useState<'published' | 'private' | 'draft'>('draft');
  const [pathname, setPathname] = useState<string>('');
  const [publishedDate, setPublishedDate] = useState<DateValue | null>(null);
  const [updatedDate, setUpdatedDate] = useState<DateValue | null>(null);
  const [keywords, setKeywords] = useState<string>('');
  const [thumbnailImgUrl, setThumbnailImgUrl] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});

  const [articleLoading, setArticleLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const editorRef = useRef<MDXEditorMethods | null>(null);

  const removeError = (key: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const resetContents = () => {
    setTitle('');
    setType('post');
    setStatus('draft');
    setPathname('');
    setPublishedDate(parseDateTime(dayjs().format('YYYY-MM-DDTHH:mm:ss')));
    setUpdatedDate(null);
    setKeywords('');
    setThumbnailImgUrl('');

    editorRef.current?.setMarkdown('');
  };

  const getCurrentArticleData = () => {
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
    if (keywords) updateData!.keywords = keywords;
    if (thumbnailImgUrl) updateData!.thumbnail_img_url = thumbnailImgUrl;

    return updateData;
  };

  const checkValues = async () => {
    setErrors({});

    const newErrors: Errors = {};

    if (!title.trim()) newErrors.title = { message: '제목을 입력하세요' };

    if (!type) newErrors.type = { message: '타입을 선택하세요' };

    if (!status) newErrors.type = { message: '상태를 선택하세요' };

    if (!pathname.trim()) {
      newErrors.pathname = { message: '경로를 입력하세요.' };
    } else if (!isKebabCase(pathname) || containsSpecialCharacters(pathname, ['-'])) {
      newErrors.pathname = { message: '형식이 올바르지 않습니다.' };
    }

    if (pathname.trim()) {
      const res = await api.client.archive.getArticleByPathname({ pathname: pathname });
      const item = res.data?.item;

      if (item && article && item.id !== article.id) {
        newErrors.pathname = { message: '이미 존재하는 경로입니다.' };
      }
      if (item && !article) {
        newErrors.pathname = { message: '이미 존재하는 경로입니다.' };
      }
    }

    if (!publishedDate) newErrors.publishedDate = { message: '게시일을 입력하세요.' };

    const publishedDateNumber = Number(dayjs(publishedDate?.toString()).toDate());
    const updatedDateNumber = Number(dayjs(updatedDate?.toString()).toDate());

    if (updatedDate && publishedDateNumber > updatedDateNumber) {
      newErrors.updatedDate = { message: '수정일은 게시일보다 이전일 수 없습니다.' };
    }

    if (thumbnailImgUrl) {
      try {
        new URL(thumbnailImgUrl);
      } catch (e) {
        newErrors.thumbnailImgUrl = { message: 'URL 형식이 올바르지 않습니다.' };
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const createArticle = async () => {
    setSubmitLoading(true);

    const checked = await checkValues();
    if (!checked) {
      setSubmitLoading(false);
      return;
    }

    const newData = getCurrentArticleData();

    const res = await api.client.archive.createArticle(newData as PostArticle | ShortsArticle);
    if (res.data?.success) {
      router.replace(`/write?pathname=${res.data.item.pathname}`);
    }

    setSubmitLoading(false);
  };

  const updateArticle = async () => {
    setSubmitLoading(true);

    const checked = await checkValues();
    if (!checked || !article) {
      setSubmitLoading(false);
      return;
    }

    const updateContents = getCurrentArticleData();

    const updateData = { id: article.id, ...updateContents };

    const res = await api.client.archive.updateArticle(updateData);

    if (res.data?.success) {
      setArticle(res.data.item);
    }

    setSubmitLoading(false);
  };

  const setArticleContents = (article: PostArticle | ShortsArticle) => {
    setArticleLoading(true);

    if (article) {
      setTitle(article.title);
      setType(article.type);
      setPathname(article.pathname);
      setPublishedDate(parseDateTime(dayjs(article.published_date).format('YYYY-MM-DDTHH:mm:ss')));
      setUpdatedDate(parseDateTime(dayjs(article.updated_date).format('YYYY-MM-DDTHH:mm:ss')));
      setKeywords(article.keywords ?? '');
      setThumbnailImgUrl(article.thumbnail_img_url ?? '');

      editorRef.current?.setMarkdown(article.content);
    } else {
      setPublishedDate(parseDateTime(dayjs().format('YYYY-MM-DDTHH:mm:ss')));
    }

    setArticleLoading(false);
  };

  const handlePathnameChanged = async (pathnameSearchParam?: string | null) => {
    setArticleLoading(true);

    if (pathnameSearchParam) {
      const res = await api.client.archive.getArticleByPathname({ pathname: pathnameSearchParam });
      const item = res.data?.item;
      if (item) {
        setArticle(item);
      } else {
        router.replace('/write');
      }
    } else {
      setArticle(null);
    }

    setArticleLoading(false);
  };

  const handleChangedArticle = (changedArticle: PostArticle | ShortsArticle | null) => {
    if (changedArticle) setArticleContents(changedArticle);
    else resetContents();
  };

  useEffect(() => {
    handleChangedArticle(article);
  }, [article]);

  useEffect(() => {
    const pathnameSearchParam = searchParams.get('pathname');
    handlePathnameChanged(pathnameSearchParam);
  }, [searchParams]);

  return (
    <WriteScreenStyled className={articleLoading ? 'is-content-loading' : ''}>
      <div className="content-loading-overlay">
        <Spinner size="lg" color="default" />
      </div>

      <div className="editor-area">
        <Input
          isRequired
          className="mb-4"
          placeholder="Title"
          variant="bordered"
          size="lg"
          radius="sm"
          color="default"
          value={title}
          onValueChange={setTitle}
          isInvalid={!!errors.title}
          errorMessage={errors.title?.message}
          onFocus={() => removeError('title')}
        />

        <div className="editor-wrap">
          <MDEditor className="flex-grow" markdown="" ref={editorRef} />
        </div>
      </div>

      <div className="info-area">
        <div className="fields">
          <Input
            className="mb-4"
            isRequired
            label="Pathname"
            variant="flat"
            size="sm"
            value={pathname}
            onValueChange={setPathname}
            isInvalid={!!errors.pathname}
            errorMessage={errors.pathname?.message}
            onFocus={() => removeError('pathname')}
          />

          <Select
            className="mb-2"
            isRequired
            label="Status"
            size="sm"
            selectedKeys={[status]}
            onChange={(e) => {
              setStatus(e.target.value as 'published' | 'private' | 'draft');
            }}
            isInvalid={!!errors.status}
            errorMessage={errors.status?.message}
            onFocus={() => removeError('status')}
          >
            <SelectItem key={'published'}>공개</SelectItem>
            <SelectItem key={'private'}>비공개</SelectItem>
            <SelectItem key={'draft'}>작성중</SelectItem>
          </Select>

          <Select
            className="mb-4"
            isRequired
            label="Type"
            size="sm"
            selectedKeys={[type]}
            onChange={(e) => {
              setType(e.target.value as 'post' | 'shorts');
            }}
            isInvalid={!!errors.type}
            errorMessage={errors.type?.message}
            onFocus={() => removeError('type')}
          >
            <SelectItem key={'post'}>Post</SelectItem>
            <SelectItem key={'shorts'}>Shorts</SelectItem>
          </Select>

          <DateInput
            className="mb-2"
            isRequired
            granularity="second"
            label="Published Date"
            size="sm"
            value={publishedDate}
            onChange={setPublishedDate}
            isInvalid={!!errors.publishedDate}
            errorMessage={errors.publishedDate?.message}
            onFocus={() => removeError('publishedDate')}
          />
          <DateInput
            className="mb-4"
            granularity="second"
            label="Updated Date"
            size="sm"
            value={updatedDate}
            onChange={setUpdatedDate}
            isInvalid={!!errors.updatedDate}
            errorMessage={errors.updatedDate?.message}
            onFocus={() => removeError('updatedDate')}
          />

          <Input label="Keywords" size="sm" value={keywords} onValueChange={setKeywords} />

          <div className="flex mt-2">
            <Input
              label="Thumbnail Image URL"
              size="sm"
              value={thumbnailImgUrl}
              onValueChange={setThumbnailImgUrl}
              isInvalid={!!errors.thumbnailImgUrl}
              errorMessage={errors.thumbnailImgUrl?.message}
              onFocus={() => removeError('thumbnailImgUrl')}
            />
          </div>
        </div>
        <div className="submits">
          {!!article ? (
            <Button
              color="secondary"
              onClick={updateArticle}
              isLoading={submitLoading || articleLoading}
              size="lg"
              fullWidth
            >
              Update
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={createArticle}
              isLoading={submitLoading || articleLoading}
              size="lg"
              fullWidth
            >
              Create
            </Button>
          )}
        </div>
      </div>
    </WriteScreenStyled>
  );
};

const WriteScreenStyled = styled.div`
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  padding: 16px;
  max-width: calc(720px + 280px);
  margin: 0 auto;

  @media screen and (max-width: 641px) {
    flex-direction: column;
    height: auto;
    padding: 12px 8px;
  }

  &.is-content-loading {
    pointer-events: none;

    .content-loading-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 9999;
      top: 0;
      left: 0;
      backdrop-filter: blur(5px);

      * {
        z-index: 99999;
      }
    }
  }

  .content-loading-overlay {
    display: none;
  }

  .editor-area {
    width: calc(100% - 280px);
    height: 100%;

    display: flex;
    flex-direction: column;

    @media screen and (max-width: 641px) {
      width: 100%;
    }

    .editor-wrap {
      flex-grow: 1;
      overflow-y: auto;

      @media screen and (max-width: 641px) {
        height: 680px;
      }
    }
  }

  .info-area {
    min-width: 280px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 8px;

    @media screen and (max-width: 641px) {
      padding-left: 0;
      margin-top: 16px;
    }

    .submits {
      margin-top: 16px;
    }
  }
`;

export default WriteScreen;
