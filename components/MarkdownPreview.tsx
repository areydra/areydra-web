'use client'
import dynamic from 'next/dynamic'

const Preview = dynamic(() => import('./MDXPreview'), { ssr: false })

export const MarkdownPreview = ({ markdown }: { markdown: string }) => {
  return <Preview markdown={markdown} />
}
