"use client";

import type { ForwardedRef } from "react";
import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  // Plugins
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  frontmatterPlugin,
  diffSourcePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  // Toolbar components
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  InsertAdmonition,
  InsertFrontmatter,
  ChangeCodeMirrorLanguage,
  DiffSourceToggleWrapper,
  ConditionalContents,
  Separator,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

type MdxEditorProps = {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
} & MDXEditorProps;

const MdxEditor = ({ editorRef, ...props }: MdxEditorProps) => {
  return (
    <MDXEditor
      contentEditableClassName="prose"
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(), // needed by CreateLink
        imagePlugin(), // needed by InsertImage
        tablePlugin(), // needed by InsertTable
        codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
        codeMirrorPlugin({
          // needed by ChangeCodeMirrorLanguage
          codeBlockLanguages: { js: "JavaScript", ts: "TypeScript", css: "CSS", html: "HTML", "": "Plain text" },
        }),
        directivesPlugin({
          // needed by InsertAdmonition / ChangeAdmonitionType
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        frontmatterPlugin(), // needed by InsertFrontmatter
        diffSourcePlugin({ viewMode: "rich-text" }), // needed by DiffSourceToggleWrapper
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <ConditionalContents
                options={[
                  {
                    // Inside a code block only the language picker is useful.
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        <UndoRedo />
                        <Separator />
                        <BoldItalicUnderlineToggles />
                        <CodeToggle />
                        <Separator />
                        <BlockTypeSelect />
                        <ListsToggle />
                        <Separator />
                        <CreateLink />
                        <InsertImage />
                        <InsertTable />
                        <InsertThematicBreak />
                        <Separator />
                        <InsertCodeBlock />
                        <InsertAdmonition />
                        <InsertFrontmatter />
                      </>
                    ),
                  },
                ]}
              />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
};

export default MdxEditor;
