'use client'
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
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

export default function MDXPreview({ markdown }: { markdown: string }) {
  return (
    <div className="mdx-preview-clean-view">
      <MDXEditor
        markdown={markdown}
        readOnly={true}
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
          codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }), // JANGAN dikosongin, ini yang bikin error N/A
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: 'JavaScript',
              html: 'HTML',
              css: 'CSS',
            },
            autoLoadLanguageSupport: true,
          }),
          directivesPlugin({
            directiveDescriptors: [AdmonitionDirectiveDescriptor],
          }),
          frontmatterPlugin(),
          diffSourcePlugin({ viewMode: 'rich-text' }),
          markdownShortcutPlugin(),
        ]}
      />
    </div>
  )
}
