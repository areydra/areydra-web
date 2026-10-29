"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

import { useAdminData } from "@/providers/majourney/AdminDataProvider";
import { stripHtmlToText } from "@/lib/strip-html";
import { ApiError } from "@/services/admin-api-client";

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
        <p className="border-ink text-danger-text mb-4 border-[3px] bg-white p-3 text-[13px] font-bold">
          {errors.blog}
        </p>
      )}
      {actionError && (
        <p className="border-ink text-danger-text mb-4 border-[3px] bg-white p-3 text-[13px] font-bold">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex justify-end">
        <Link
          href="/majourney/blog/new"
          className="border-ink bg-lime text-ink cursor-pointer border-[3px] px-4 py-2.5 text-[13px] font-bold shadow-[4px_4px_0_#111]"
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
              className="border-ink box-border flex h-full flex-col overflow-hidden border-[3px] bg-white shadow-[6px_6px_0_#111]"
            >
              {b.thumbnailUrl && (
                <div className="bg-ink flex h-20 shrink-0 items-center justify-center overflow-hidden px-3 text-center text-xs font-bold text-white">
                  <Image
                    src={b.thumbnailUrl}
                    alt=""
                    width={400}
                    height={160}
                    sizes="240px"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <h3 className="text-ink m-0 text-[15px] font-extrabold">{b.title}</h3>
                  <span
                    className={`border-ink inline-block border-2 px-2.5 py-0.5 text-xs font-bold ${
                      published ? "bg-ink text-white" : "text-ink bg-white"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="text-ink mb-2 line-clamp-3 text-sm">{stripHtmlToText(b.excerpt)}</p>
                <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
                  {b.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="border-ink text-ink border-2 bg-white px-2.25 py-1 text-[11px] font-bold"
                    >
                      {tag.name}
                    </span>
                  ))}
                  <span className="text-ink-muted text-[11px]">
                    {b.wordCount} words · {b.timeToReadMinutes} min
                  </span>
                </div>
                <div className="mt-auto flex gap-2">
                  <Link
                    href={`/majourney/blog/${b.id}/edit`}
                    className="border-ink text-ink flex-1 cursor-pointer border-[3px] bg-white py-2 text-center text-[13px] font-bold"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    aria-label={`Delete ${b.title}`}
                    disabled={deletingId === b.id}
                    className="border-ink bg-danger flex-1 cursor-pointer border-[3px] py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
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
