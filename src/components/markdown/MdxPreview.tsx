"use client";

import {
  MDXEditor,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  thematicBreakPlugin,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  frontmatterPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  linkDialogPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  markdownShortcutPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

type MdxPreviewProps = {
  markdown: string;
};

const MdxPreview = ({ markdown }: MdxPreviewProps) => {
  return (
    <div className="mdx-preview-clean-view">
      <MDXEditor
        markdown={markdown}
        readOnly
        contentEditableClassName="prose max-w-none font-sans prose-headings:font-sans antialiased"
        plugins={[
          headingsPlugin(),
          quotePlugin(),
          listsPlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          tablePlugin(),
          // A default language is required: an empty one makes CodeMirror error.
          codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: "JavaScript",
              html: "HTML",
              css: "CSS",
            },
            autoLoadLanguageSupport: true,
          }),
          directivesPlugin({
            directiveDescriptors: [AdmonitionDirectiveDescriptor],
          }),
          frontmatterPlugin(),
          diffSourcePlugin({ viewMode: "rich-text" }),
          markdownShortcutPlugin(),
        ]}
      />
    </div>
  );
};

export default MdxPreview;
