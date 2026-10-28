"use client";

import Field from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import TextInput from "@/components/ui/TextInput";
import ImageUploadField from "@/components/majourney/ImageUploadField";
import type { BlogPostInput } from "@/types/admin.types";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useEffect, useRef } from "react";
import MarkdownEditor from "@/components/markdown/MarkdownEditor";

type BlogPostFormProps = {
  mode: "add" | "edit";
  form: BlogPostInput;
  setField: <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) => void;
  tagsText: string;
  onTagsTextChange: (value: string) => void;
};

export default function BlogPostForm({ mode, form, setField, tagsText, onTagsTextChange }: BlogPostFormProps) {
  const ref = useRef<MDXEditorMethods>(null)

  useEffect(function initMarkdownEditor() {
    ref.current?.getMarkdown()
  }, []);

  return (
    <>
      <Field label="Title">
        <TextInput value={form.title} onChange={(e) => setField("title", e.target.value)} />
      </Field>
      {mode === "edit" && (
        <Field label="Status">
          <Select value={form.status} onChange={(e) => setField("status", e.target.value as BlogPostInput["status"])}>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </Select>
        </Field>
      )}
      <Field label="Category">
        <TextInput value={form.category ?? ""} onChange={(e) => setField("category", e.target.value || null)} />
      </Field>
      <Field label="Tags (comma-separated)">
        <TextInput value={tagsText} onChange={(e) => onTagsTextChange(e.target.value)} />
      </Field>
      <div className="mb-3.5">
        <ImageUploadField
          label="Thumbnail"
          value={form.thumbnailUrl}
          onChange={(url) => setField("thumbnailUrl", url)}
          folder="blog"
        />
      </div>
      <Field label="Content">
        <MarkdownEditor
          markdown={form.content}
          className="border-[3px] border-ink"
          onChange={(html) => setField("content", html)}
        />
      </Field>
    </>
  );
}
