'use client';

// apps/web/src/components/MDContent/index.tsx
import React, { memo, useMemo } from 'react';

import Markdown, { ExtraProps } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import '@/styles/markdown.scss';
import { removeFrontmatter } from '@/utils';

import CodeBlock from './CodeBlock';
import ImageBlock from './ImageBlock';
import MermaidBlock from './MermaidBlock';

interface MDContentProps {
  content: string;
  frontmatter?: boolean;
  codeBlockType?: 'sandpack' | 'highlighter';
}

const createHeading = (
  props: React.ClassAttributes<HTMLHeadingElement> & React.HTMLAttributes<HTMLHeadingElement> & ExtraProps,
  depth: number,
) => {
  const { children } = props;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const hash = `#${children}`;
    window.history.pushState(null, '', hash);
  };

  const Component = `h${depth}` as React.ElementType;

  return (
    <Component id={children as string}>
      <a className="no-underline hover:opacity-80" href={`#${children}`} onClick={handleClick}>
        {children}
      </a>
    </Component>
  );
};

const MDContent = (props: MDContentProps) => {
  const { content, frontmatter = false, codeBlockType = 'highlighter' } = props;

  const parsedContent = useMemo(() => {
    if (!frontmatter) return removeFrontmatter(content);
    return content;
  }, [content, frontmatter]);

  return (
    <Markdown
      className="md-content-root prose"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={{
        h1: (props) => createHeading(props, 1),
        h2: (props) => createHeading(props, 2),
        h3: (props) => createHeading(props, 3),
        img(props) {
          const { src, alt } = props;
          return <ImageBlock src={src} alt={alt} />;
        },
        code(props) {
          const { children, className, node, ...rest } = props;

          if (!className) {
            return <code {...rest}>{children}</code>;
          }

          const lang = className?.replace('language-', '');

          if (lang === 'mermaid') {
            return <MermaidBlock chart={String(children).replace(/\n$/, '')} id="" />;
          }

          return <CodeBlock language={lang} value={String(children)} type={codeBlockType} />;
        },
      }}
    >
      {parsedContent}
    </Markdown>
  );
};

export default memo(MDContent);
