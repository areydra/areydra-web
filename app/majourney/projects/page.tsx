"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import { ApiError } from "@/lib/majourney/api-client";
import { stripHtmlToText } from "@/lib/majourney/html";

export default function AdminProjectsPage() {
  const { projects, deleteProject, errors } = useAdminData();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    setActionError("");
    setDeletingId(id);
    try {
      await deleteProject(id);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {errors.projects && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {errors.projects}
        </p>
      )}
      {actionError && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex justify-end">
        <Link
          href="/majourney/projects/new"
          className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-4 py-2.5 text-[13px] font-bold text-[#111] shadow-[4px_4px_0_#111]"
        >
          + Add project
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="box-border overflow-hidden border-[3px] border-[#111] bg-white shadow-[6px_6px_0_#111]"
          >
            <div className="flex h-[110px] items-center justify-center overflow-hidden bg-[#111] px-3 text-center text-xs font-bold text-white">
              {p.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded URL
                <img src={p.thumbnailUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                "No thumbnail set"
              )}
            </div>
            <div className="p-4">
              <h3 className="m-0 mb-1 text-[15px] font-extrabold text-[#111]">{p.title}</h3>
              <p className="m-0 mb-2.5 text-xs text-[#555]">/{p.slug}</p>
              <p className="m-0 mb-3 line-clamp-3 text-sm text-[#111]">{stripHtmlToText(p.description)}</p>
              <div className="mb-3.5 flex flex-wrap gap-1.5">
                {p.techStack.map((tech) => (
                  <span
                    key={tech.id}
                    className="border-2 border-[#111] bg-white px-[9px] py-1 text-[11px] font-bold text-[#111]"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/majourney/projects/${p.id}/edit`}
                  className="flex-1 cursor-pointer border-[3px] border-[#111] bg-white py-2 text-center text-[13px] font-bold text-[#111]"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="flex-1 cursor-pointer border-[3px] border-[#111] bg-[#ff3b30] py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === p.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
