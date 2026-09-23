"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import { ApiError } from "@/lib/majourney/api-client";

export default function AdminBlogPage() {
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
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {errors.blog && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {errors.blog}
        </p>
      )}
      {actionError && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex justify-end">
        <Link
          href="/majourney/blog/new"
          className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-4 py-2.5 text-[13px] font-bold text-[#111] shadow-[4px_4px_0_#111]"
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
              className="box-border flex h-full flex-col overflow-hidden border-[3px] border-[#111] bg-white shadow-[6px_6px_0_#111]"
            >
              <div className="flex h-20 shrink-0 items-center justify-center overflow-hidden bg-[#111] px-3 text-center text-xs font-bold text-white">
                {b.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded URL
                  <img src={b.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  "No thumbnail set"
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <h3 className="m-0 text-[15px] font-extrabold text-[#111]">{b.title}</h3>
                  <span
                    className={`inline-block border-2 border-[#111] px-2.5 py-0.5 text-xs font-bold ${
                      published ? "bg-[#111] text-white" : "bg-white text-[#111]"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="m-0 mb-3 line-clamp-3 text-sm text-[#111]">{b.excerpt}</p>
                <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
                  {b.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="border-2 border-[#111] bg-white px-[9px] py-1 text-[11px] font-bold text-[#111]"
                    >
                      {tag.name}
                    </span>
                  ))}
                  <span className="text-[11px] text-[#555]">
                    {b.wordCount} words · {b.timeToReadMinutes} min
                  </span>
                </div>
                <div className="mt-auto flex gap-2">
                  <Link
                    href={`/majourney/blog/${b.id}/edit`}
                    className="flex-1 cursor-pointer border-[3px] border-[#111] bg-white py-2 text-center text-[13px] font-bold text-[#111]"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    disabled={deletingId === b.id}
                    className="flex-1 cursor-pointer border-[3px] border-[#111] bg-[#ff3b30] py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
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
}
