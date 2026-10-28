"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/providers/majourney/AdminDataProvider";
import { ApiError } from "@/services/admin-api-client";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";

const BlogPostsPage = () => {
  const { blogPosts, deleteBlogPost, errors } = useAdminData();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    setActionError("");
    setDeletingId(id);
    try {
      await deleteBlogPost(id);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete blog post.");
    }
    setDeletingId(null);
  };

  return (
    <div>
      {errors.blog && (
        <p className="mb-4 border-[3px] border-ink bg-white p-3 text-[13px] font-bold text-danger-text">
          {errors.blog}
        </p>
      )}
      {actionError && (
        <p className="mb-4 border-[3px] border-ink bg-white p-3 text-[13px] font-bold text-danger-text">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex justify-end">
        <Link
          href="/majourney/blog/new"
          className="cursor-pointer border-[3px] border-ink bg-lime px-4 py-2.5 text-[13px] font-bold text-ink shadow-[4px_4px_0_#111]"
        >
          + Add blog post
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {blogPosts.map((b) => {
          const published = b.status === "published";
          return (
            <div
              key={b.id}
              className="box-border flex h-full flex-col overflow-hidden border-[3px] border-ink bg-white shadow-[6px_6px_0_#111]"
            >
              {b.thumbnailUrl && (
                <div className="flex h-20 shrink-0 items-center justify-center overflow-hidden bg-ink px-3 text-center text-xs font-bold text-white">
                  {/* Arbitrary upload URL: next/image needs every host allowlisted. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.thumbnailUrl}
                    alt=""
                    width={400}
                    height={160}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <h3 className="m-0 text-[15px] font-extrabold text-ink">{b.title}</h3>
                  <span
                    className={`inline-block border-2 border-ink px-2.5 py-0.5 text-xs font-bold ${
                      published ? "bg-ink text-white" : "bg-white text-ink"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <MarkdownPreview markdown={b.excerpt}/>
                <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
                  {b.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="border-2 border-ink bg-white px-2.25 py-1 text-[11px] font-bold text-ink"
                    >
                      {tag.name}
                    </span>
                  ))}
                  <span className="text-[11px] text-ink-muted">
                    {b.wordCount} words · {b.timeToReadMinutes} min
                  </span>
                </div>
                <div className="mt-auto flex gap-2">
                  <Link
                    href={`/majourney/blog/${b.id}/edit`}
                    className="flex-1 cursor-pointer border-[3px] border-ink bg-white py-2 text-center text-[13px] font-bold text-ink"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    aria-label={`Delete ${b.title}`}
                    disabled={deletingId === b.id}
                    className="flex-1 cursor-pointer border-[3px] border-ink bg-danger py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === b.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogPostsPage;
