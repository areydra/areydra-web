"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminFormPage from "@/components/majourney/AdminFormPage";
import BlogPostForm from "@/components/majourney/BlogPostForm";
import { ApiError } from "@/lib/majourney/api-client";
import { toForm, splitList } from "@/lib/majourney/blog";
import type { BlogPostInput } from "@/lib/majourney/inputs";

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const { blogPosts, updateBlogPost } = useAdminData();
  const router = useRouter();
  const item = blogPosts.find((b) => b.id === id);

  const [form, setForm] = useState<BlogPostInput | null>(item ? toForm(item) : null);
  const [tagsText, setTagsText] = useState(item ? item.tags.map((t) => t.name).join(", ") : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!item || !form) {
    return (
      <div>
        <p className="mb-3 text-sm font-semibold text-[#111]">Blog post not found.</p>
        <Link href="/majourney/blog" className="text-[13px] font-bold text-[#111] underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const setField = <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await updateBlogPost(id, { ...form, tagNames: splitList(tagsText) });
      router.push("/majourney/blog");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save blog post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormPage title="Edit Blog Post" backHref="/majourney/blog" backLabel="Blog" saving={saving} error={error} onSave={save}>
      <BlogPostForm mode="edit" form={form} setField={setField} tagsText={tagsText} onTagsTextChange={setTagsText} />
    </AdminFormPage>
  );
}
