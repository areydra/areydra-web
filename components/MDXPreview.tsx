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
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

export default function MDXPreview({ markdown }: { markdown: string }) {
  return (
    <MDXEditor
      markdown={markdown}
      readOnly={true} // Dikunci sepenuhnya
      /* Memaksa font Archivo seragam di teks biasa maupun heading */
      contentEditableClassName="prose max-w-none font-sans prose-headings:font-sans antialiased"
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        imagePlugin(),
        tablePlugin(),
        /* Gunakan plugin code block murni tanpa codeMirror/toolbar kontrol picker */
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        frontmatterPlugin(),
      ]}
    />
  )
}
