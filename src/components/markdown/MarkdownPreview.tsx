"use client";

import dynamic from "next/dynamic";

// MDXEditor touches the DOM at import time, so it is client-only and split out
// of the initial bundle. `ssr: false` is the price of rendering the body with
// the editor's own engine — see MdxPreview for the trade-off.
const Preview = dynamic(() => import("./MdxPreview"), { ssr: false });

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
}

/**
 * The body renderer for every public surface: the same MDXEditor the admin writes
 * in, in read-only mode, so the site and the panel cannot disagree.
 */
const MarkdownPreview = ({ markdown, className }: MarkdownPreviewProps) => (
  <Preview
    markdown={markdown}
    className={className}
  />
);

export default MarkdownPreview;
