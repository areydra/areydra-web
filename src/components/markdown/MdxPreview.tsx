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
  /** Extra classes for the wrapper — the cards clamp the height here. */
  className?: string;
};

/**
 * Read-only MDXEditor, i.e. the same renderer the admin writes with.
 *
 * This is deliberate duplication of the engine rather than a second markdown
 * implementation: whatever the editor draws in `majourney`, this draws on the
 * public page, down to the editor's own DOM and stylesheet. The alternative — a
 * server-side markdown renderer — always drifts from the editor in some corner
 * (admonitions, code blocks, tables), which is exactly what this replaces.
 *
 * Cost, accepted on purpose: the body is client-rendered, so it is not in the
 * first HTML byte (SEO/LCP) and it can shift after hydration (CLS).
 */
const MdxPreview = ({ markdown, className }: MdxPreviewProps) => {
  return (
    <div className={className ? `mdx-preview-clean-view ${className}` : "mdx-preview-clean-view"}>
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
              ts: "TypeScript",
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
