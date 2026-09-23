"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminFormPage from "@/components/majourney/AdminFormPage";
import BlogPostForm from "@/components/majourney/BlogPostForm";
import { ApiError } from "@/lib/majourney/api-client";
import { EMPTY_FORM, splitList } from "@/lib/majourney/blog";
import type { BlogPostInput } from "@/lib/majourney/inputs";

export default function NewBlogPostPage() {
  const { createBlogPost } = useAdminData();
  const router = useRouter();
  const [form, setForm] = useState<BlogPostInput>(EMPTY_FORM);
  const [tagsText, setTagsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await createBlogPost({ ...form, tagNames: splitList(tagsText) });
      router.push("/majourney/blog");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save blog post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormPage title="Add Blog Post" backHref="/majourney/blog" backLabel="Blog" saving={saving} error={error} onSave={save}>
      <BlogPostForm mode="add" form={form} setField={setField} tagsText={tagsText} onTagsTextChange={setTagsText} />
    </AdminFormPage>
  );
}
