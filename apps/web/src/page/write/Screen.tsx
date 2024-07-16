'use client';

// apps/web/src/page/write/Screen.tsx
import React from 'react';

import { Input, Spinner } from '@nextui-org/react';
import styled from 'styled-components';

import MDEditor from '@/components/MDEditor';

import InfoArea from './components/InfoArea';
import useArticleWrite from './hooks/useArticleWrite';

const WriteScreen = () => {
  const articleWriteHook = useArticleWrite();
  const { editorRef, title, setTitle, errors, fetchLoading, removeError } = articleWriteHook;

  return (
    <WriteScreenStyled className={fetchLoading ? 'is-content-loading' : ''}>
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

      <InfoArea hook={articleWriteHook} />
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
`;

export default WriteScreen;
