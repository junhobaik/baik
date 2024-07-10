'use client';

// apps/web/src/components/MDContent/CodeBlock.tsx
import React, { useId, useMemo } from 'react';

import { SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  value: string;
  language?: string;
  type?: 'sandpack' | 'highlighter';
}

const CodeBlock = ({ language, value, type = 'highlighter' }: CodeBlockProps) => {
  const lang = useMemo(() => {
    if (!language) return 'js';

    const jsxList = ['react'];
    if (jsxList.includes(language)) {
      return 'tsx';
    }

    return language;
  }, [language]);

  if (type === 'sandpack') return <SandPackCodeBlock language={language} value={value} />;

  return (
    <SyntaxHighlighter language={lang} style={coy} showLineNumbers showInlineLineNumbers>
      {value}
    </SyntaxHighlighter>
  );
};

const SandPackCodeBlock = ({ language, value }: CodeBlockProps) => {
  const id = useId();
  const options = useMemo<any>(() => {
    const reactList = ['jsx', 'react'];
    const reactTsList = ['tsx'];
    const staticList = ['html'];

    if (language && staticList.includes(language)) {
      return {
        files: {
          'index.html': {
            code: value,
            active: true,
            hidden: false,
          },
        },
        template: 'static',
      };
    }

    if (language && reactList.includes(language)) {
      return {
        files: {
          'App.jsx': {
            code: value,
            active: true,
            hidden: false,
          },
        },
        template: 'vite-react',
      };
    }

    if (language && reactTsList.includes(language)) {
      return {
        files: {
          'App.tsx': {
            code: value,
            active: true,
            hidden: false,
          },
        },
        template: 'vite-react-ts',
      };
    }

    return {
      files: {
        'index.js': {
          code: value,
          active: true,
          hidden: false,
        },
      },
      template: 'vanilla',
    };
  }, [language, value]);

  return (
    <SandpackProvider template={options.template} files={options.files} id={id}>
      <SandpackLayout>
        <SandpackCodeEditor
          showTabs={false}
          showLineNumbers={true}
          showInlineErrors
          wrapContent
          closableTabs
          initMode="user-visible"
        />
        {options.template.includes('react') && <SandpackPreview />}
      </SandpackLayout>
    </SandpackProvider>
  );
};

export default CodeBlock;
