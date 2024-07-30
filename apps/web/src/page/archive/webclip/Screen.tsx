'use client';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { ClipArticle, ClipArticleBase, RssFeedItemBase } from '@baik/types';
import { parseDateTime } from '@internationalized/date';
import { Button, Card, DateInput, DateValue, Image, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { IconPaperclip, IconSparkles, IconWorld } from '@tabler/icons-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import api from '@/api';
import { delay, getOriginFromUrl, isValidURL, parseYoutubeShareLink } from '@/utils';

interface ClipScreenProps {}

const ClipScreen = (props: ClipScreenProps) => {
  const searchParams = useSearchParams();

  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<ClipArticle['status']>('published');
  const [title, setTitle] = useState('');
  const [clipDate, setClipDate] = useState<DateValue | null>(null);
  const [article, setArticle] = useState<Partial<ClipArticle>>({
    origin_title: '',
    content: '',
    thumbnail_img_url: '',
    site: {
      title: '',
      description: '',
      link: '',
      favicon_url: '',
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [rssFeed, setRssFeed] = useState<RssFeedItemBase | null>(null);

  const resetArticle = useCallback(() => {
    setArticle({
      origin_title: '',
      content: '',
      thumbnail_img_url: '',
      site: {
        title: '',
        description: '',
        link: '',
        favicon_url: '',
      },
    });
    setRssFeed(null);
  }, []);

  const resetAllFields = useCallback(() => {
    setUrl('');
    setStatus('published');
    setTitle('');
    setClipDate(parseDateTime(dayjs().format('YYYY-MM-DDTHH:mm:ss')));
    resetArticle();
    setErrors({});
  }, []);

  const getOpenGraphData = useCallback(async (url: string) => {
    const res = await api.client.utils.getOpenGraphData({ url });
    return res.data?.item ?? null;
  }, []);

  const getSiteData = useCallback(async (url: string) => {
    const res = await api.client.utils.getSiteData({ url });
    return res.data?.item ?? null;
  }, []);

  const getRSSFeedUrl = useCallback(async (url: string) => {
    const res = await api.client.utils.getRSSFeedUrl({ url });
    return res.data?.item ?? null;
  }, []);

  const fetchInfos = useCallback(async () => {
    if (!url) return;
    if (!isValidURL(url)) {
      setErrors({ url: 'Invalid URL' });
      return;
    }

    let _url = url;

    if (_url.startsWith('https://youtu.be')) {
      const parsedUrl = parseYoutubeShareLink(_url);
      setUrl(parsedUrl);
      _url = parsedUrl;
    }

    setAutoCompleteLoading(true);
    try {
      const origin = getOriginFromUrl(_url);

      const [ogResult, siteResult, rssResult] = await Promise.all([
        getOpenGraphData(_url),
        getSiteData(origin),
        getRSSFeedUrl(_url),
      ]);

      resetArticle();
      setTitle((prev) => ogResult?.title ?? prev);
      setArticle((prevArticle) => ({
        ...prevArticle,
        origin_title: ogResult?.title,
        content: ogResult?.description || prevArticle.content,
        thumbnail_img_url: ogResult?.image || prevArticle.thumbnail_img_url,
        site: {
          title: siteResult?.title || prevArticle.site?.title || origin,
          description: siteResult?.description || prevArticle.site?.description || '',
          link: origin,
          favicon_url: siteResult?.favicon_url || prevArticle.site?.favicon_url || '',
        },
      }));

      if (rssResult) {
        setRssFeed({
          type: 'rss',
          url: rssResult,
          data: {
            title: siteResult?.title ?? '',
            description: ogResult?.description ?? '',
            favicon_url: siteResult?.favicon_url,
            // TODO:
            items: [],
          },
        });
      }
    } catch (error) {
      console.error('Error fetching article data:', error);
    } finally {
      setAutoCompleteLoading(false);
    }
  }, [getOpenGraphData, getSiteData, url]);

  const validateClipData = useCallback(() => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!title.trim().length) newErrors.title = 'Title is required';
    if (!url) newErrors.url = 'URL is required';
    if (!clipDate) newErrors.clipDate = 'Created Date is required';
    try {
      new URL(url);
    } catch (error) {
      newErrors.url = 'Invalid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, clipDate, url]);

  const saveClip = useCallback(async () => {
    setSaveLoading(true);

    const pass = validateClipData();
    if (!pass) {
      setSaveLoading(false);
      return;
    }

    const clipDateTimeStamp = Number(dayjs(clipDate!.toString()).toDate());

    const data: ClipArticleBase = {
      type: 'clip',
      status: status,
      title: title || '',
      origin_title: article.origin_title || undefined,
      content: article.content || '',
      url: url,
      thumbnail_img_url: article.thumbnail_img_url || '',
      site: {
        title: article.site?.title || '',
        link: article.site?.link || '',
        favicon_url: article.site?.favicon_url || '',
        description: article.site?.description || '',
      },
      published_date: clipDateTimeStamp,
      updated_date: clipDateTimeStamp,
    };

    const res = await api.client.archive.createArticle(data);
    if (res.data?.success) {
      toast.success('Clip saved successfully');
      await delay(1500);
      resetAllFields();
    } else {
      toast.error('Failed to save clip');
    }

    setSaveLoading(false);
  }, [url, title, status, article, validateClipData, clipDate]);

  const handleAddRssFeed = () => {
    // TODO:
  };

  const thumbnailElement = useMemo(() => {
    if (article.thumbnail_img_url) {
      return <Image src={article.thumbnail_img_url} alt="Thumbnail" className="w-full h-auto object-cover" />;
    }
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No Thumbnail</span>
      </div>
    );
  }, [article.thumbnail_img_url]);

  const faviconElement = useMemo(() => {
    if (article.site?.favicon_url) {
      return <Image src={article.site.favicon_url} alt="Favicon" className="w-6 h-6 mr-2" />;
    }
    return (
      <div className="w-6 h-6 mr-2 bg-gray-200 flex items-center justify-center rounded">
        <IconWorld size={16} className="text-gray-400" />
      </div>
    );
  }, [article.site?.favicon_url]);

  useLayoutEffect(() => {
    setClipDate(parseDateTime(dayjs().format('YYYY-MM-DDTHH:mm:ss')));
  }, []);

  useEffect(() => {
    const url = searchParams.get('url');
    if (url) {
      setUrl(url);
      fetchInfos();
    }
  }, [searchParams, fetchInfos]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <IconPaperclip size={24} className="mr-1 text-gray-700" />
        <h1 className="text-2xl font-bold">WebClip</h1>
      </div>

      {/* Clip fields */}
      <Card className="p-4 mb-4">
        <div className="flex mb-4">
          <Input
            color="primary"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            label="URL"
            className="mr-2"
            isRequired
            fullWidth
            size="sm"
            isInvalid={!!errors.url}
            errorMessage={errors.url}
            onFocus={() => {
              setErrors((prev) => ({ ...prev, url: '' }));
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') fetchInfos();
            }}
          />
          <Button
            onClick={fetchInfos}
            isLoading={autoCompleteLoading}
            color="secondary"
            variant="flat"
            isIconOnly
            size="lg"
            isDisabled={!url}
          >
            <IconSparkles />
          </Button>
        </div>
        <div className="flex">
          <Input
            label="Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isRequired
            fullWidth
            color="primary"
            isInvalid={!!errors.title}
            errorMessage={errors.title}
            onFocus={() => {
              setErrors((prev) => ({ ...prev, title: '' }));
            }}
          />
        </div>
        <div className="flex mt-2">
          <Select
            color="primary"
            isRequired
            label="Status"
            selectedKeys={[status]}
            size="sm"
            className="mr-2"
            onChange={(e) => {
              setStatus(e.target.value as 'published' | 'private');
            }}
          >
            <SelectItem key={'published'}>공개</SelectItem>
            <SelectItem key={'private'}>비공개</SelectItem>
          </Select>
          <DateInput
            isRequired
            granularity="second"
            color="primary"
            label="Created Date"
            size="sm"
            value={clipDate}
            onChange={setClipDate}
            isInvalid={!!errors.clipDate}
            errorMessage={errors.clipDate}
            onFocus={() => {
              setErrors((prev) => ({ ...prev, clipDate: '' }));
            }}
          />
        </div>
      </Card>

      {/* Generated Info */}
      <Card className="p-4 mb-4">
        <div className="flex mb-4">
          <div className="flex-grow mr-4">
            <Input label="Original Title" name="origin_title" value={article.origin_title} className="mb-2" readOnly />
            <Textarea
              label="Description"
              name="content"
              value={article.content}
              className="mb-2"
              maxRows={2}
              readOnly
            />
          </div>
          <div className="w-1/3">{thumbnailElement}</div>
        </div>
        <div className="border-t pt-4">
          <div className="flex items-center mb-2">
            {faviconElement}
            <span className="font-bold">{article.site?.title || 'Site Title'}</span>
          </div>
          <Textarea
            label="Site Description"
            value={article.site?.description || ''}
            readOnly
            maxRows={2}
            className="mb-2"
          />
          <Input label="Site URL" value={article.site?.link || ''} readOnly className="mb-2" />
        </div>
      </Card>

      {/* RSS Feed */}
      {!!rssFeed && (
        <Card className="mb-4 p-4">
          <div className="mb-1">
            <p className="text-lg font-semibold">Found RSS feed</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {faviconElement}
              <span className="font-bold">{rssFeed.data.title || rssFeed.url}</span>
            </div>
            <Button variant="flat" color="secondary" size="sm" onClick={handleAddRssFeed}>
              Add RSS Feed
            </Button>
          </div>
        </Card>
      )}

      <Button fullWidth color="primary" onClick={saveClip} isLoading={saveLoading}>
        Add Clip
      </Button>
    </div>
  );
};

export default ClipScreen;
