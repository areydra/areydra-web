"use client";

import dynamic from "next/dynamic";

// MDXEditor touches the DOM at import time, so it is client-only and split out
// of the initial bundle.
const Preview = dynamic(() => import("./MdxPreview"), { ssr: false });

type MarkdownPreviewProps = {
  markdown: string;
};

const MarkdownPreview = ({ markdown }: MarkdownPreviewProps) => {
  return <Preview markdown={markdown} />;
};

export default MarkdownPreview;
