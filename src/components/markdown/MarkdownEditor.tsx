"use client";

import { forwardRef } from "react";
import dynamic from "next/dynamic";
import { type MDXEditorMethods, type MDXEditorProps } from "@mdxeditor/editor";

const Editor = dynamic(() => import("./MdxEditor"), { ssr: false });

const MarkdownEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => (
  <Editor {...props} editorRef={ref} />
));

MarkdownEditor.displayName = "MarkdownEditor";

export default MarkdownEditor;
