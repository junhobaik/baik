'use client';

import React, { forwardRef } from 'react';

import {
  AdmonitionDirectiveDescriptor,
  // BlockTypeSelect,
  BoldItalicUnderlineToggles,
  // ChangeAdmonitionType,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  DirectiveNode,
  EditorInFocus,
  InsertAdmonition,
  InsertCodeBlock,
  InsertImage,
  InsertSandpack,
  InsertTable,
  // InsertThematicBreak,
  // ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  SandpackConfig,
  Separator,
  ShowSandpackInfo,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  sandpackPlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import styled from 'styled-components';

import '@mdxeditor/editor/style.css';

interface MDEditorProps extends MDXEditorProps {
  markdown: string;
  contentMaxWidth?: string;
}

type AdmonitionKind = 'note' | 'tip' | 'danger' | 'info' | 'caution';

const MDEditor = forwardRef<MDXEditorMethods | null, MDEditorProps>((props, ref) => {
  const { markdown, contentMaxWidth = 'none', ...restProps } = props;
  const simpleSandpackConfig: SandpackConfig = {
    defaultPreset: 'react',
    presets: [
      {
        label: 'React',
        name: 'react',
        meta: 'live react',
        sandpackTemplate: 'react',
        sandpackTheme: 'light',
        snippetFileName: '/App.js',
        snippetLanguage: 'jsx',
        initialSnippetContent: ``,
      },
    ],
  };

  const whenInAdmonition = (editorInFocus: EditorInFocus | null) => {
    const node = editorInFocus?.rootNode;
    if (!node || node.getType() !== 'directive') {
      return false;
    }

    return ['note', 'tip', 'danger', 'info', 'caution'].includes(
      (node as DirectiveNode).getMdastNode().name as AdmonitionKind,
    );
  };

  return (
    <MDXEditorStyled className={props.className ?? ''} $contentMaxWidth={contentMaxWidth}>
      <MDXEditor
        className="mdxeditor prose"
        onChange={(e) => console.log(e)}
        ref={ref}
        markdown={markdown}
        contentEditableClassName="content-editor prose"
        plugins={[
          listsPlugin(),
          quotePlugin(),
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
          linkPlugin(),
          linkDialogPlugin(),
          frontmatterPlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),

          diffSourcePlugin({
            diffMarkdown: markdown,
            viewMode: 'rich-text',
            readOnlyDiff: true,
          }),

          codeBlockPlugin({ defaultCodeBlockLanguage: '', codeBlockEditorDescriptors: [] }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              html: 'html(html)',
              js: 'JavaScript(js)',
              ts: 'TypeScript JSX(ts)',
              css: 'CSS(css)',
              txt: 'Plain Text(text)',
              jsx: 'JavaScript JSX(jsx)',
              tsx: 'TypeScript JSX(tsx)',
              shell: 'Shell(shell)',
              bash: 'bash(bash)',
              '': 'Unspecified',
            },
          }),
          sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),

          imagePlugin({
            imageAutocompleteSuggestions: [''],
          }),

          directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),

          toolbarPlugin({
            toolbarContents: () => {
              return (
                <DiffSourceToggleWrapper>
                  <ConditionalContents
                    options={[
                      {
                        when: (editor) => editor?.editorType === 'codeblock',
                        contents: () => <ChangeCodeMirrorLanguage />,
                      },
                      { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                      {
                        fallback: () => (
                          <>
                            <UndoRedo />
                            <Separator />
                            <BoldItalicUnderlineToggles />
                            <CodeToggle />
                            {/* <Separator /> */}
                            {/* <ListsToggle /> */}
                            {/* <Separator /> */}

                            {/* <BlockTypeSelect /> */}
                            {/* <ConditionalContents
                              options={[
                                { when: whenInAdmonition, contents: () => <ChangeAdmonitionType /> },
                                { fallback: () => <BlockTypeSelect /> },
                              ]}
                            /> */}

                            <Separator />

                            <CreateLink />
                            <InsertImage />

                            <Separator />

                            <InsertTable />
                            {/* <InsertThematicBreak /> */}

                            <Separator />
                            <InsertCodeBlock />
                            <InsertSandpack />

                            <ConditionalContents
                              options={[
                                {
                                  when: (editorInFocus) => !whenInAdmonition(editorInFocus),
                                  contents: () => (
                                    <>
                                      <Separator />
                                      <InsertAdmonition />
                                    </>
                                  ),
                                },
                              ]}
                            />
                          </>
                        ),
                      },
                    ]}
                  />
                </DiffSourceToggleWrapper>
              );
            },
          }),
        ]}
        {...restProps}
      />
    </MDXEditorStyled>
  );
});

const MDXEditorStyled = styled.div<{ $contentMaxWidth: string }>`
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  background-color: #eeeeee;

  height: 100%;
  width: 100%;

  .mdxeditor {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .mdxeditor-diff-source-wrapper {
    overflow-y: scroll;
  }
  .content-editor {
    width: 100%;
    max-width: none;
    max-width: ${(props) => props.$contentMaxWidth};
    background-color: #fff;
  }
  .mdxeditor-toolbar {
    min-height: 44px;
  }
`;

MDEditor.displayName = 'MDEditor';

export default MDEditor;
