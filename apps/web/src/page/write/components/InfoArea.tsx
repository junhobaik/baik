'use client';

// apps/web/src/page/write/components/InfoArea.tsx
import React from 'react';

import { Button, DateInput, Input, Select, SelectItem } from '@nextui-org/react';
import styled from 'styled-components';

import useArticleWrite from '../hooks/useArticleWrite';

type UseArticleWriteReturn = ReturnType<typeof useArticleWrite>;

interface InfoAreaProps {
  hook: UseArticleWriteReturn;
}

const InfoArea = (props: InfoAreaProps) => {
  const {
    article,
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
    fetchLoading,
    submitLoading,
    removeError,
    createArticle,
    updateArticle,
    getCurrentContents,
  } = props.hook;

  return (
    <InfoAreaStyled>
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
            isLoading={submitLoading || fetchLoading}
            size="lg"
            fullWidth
          >
            Update
          </Button>
        ) : (
          <Button color="primary" onClick={createArticle} isLoading={submitLoading || fetchLoading} size="lg" fullWidth>
            Create
          </Button>
        )}
      </div>
    </InfoAreaStyled>
  );
};

const InfoAreaStyled = styled.div`
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
`;
export default InfoArea;
