"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

import { useAdminData } from "@/providers/majourney/AdminDataProvider";
import { ApiError } from "@/lib/admin-api-client";
import { stripHtmlToText } from "@/lib/strip-html";

const ProjectsPage = () => {
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
    }
    setDeletingId(null);
  };

  return (
    <div>
      {errors.projects && (
        <p className="border-ink text-danger-text mb-4 border-[3px] bg-white p-3 text-[13px] font-bold">
          {errors.projects}
        </p>
      )}
      {actionError && (
        <p className="border-ink text-danger-text mb-4 border-[3px] bg-white p-3 text-[13px] font-bold">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex justify-end">
        <Link
          href="/majourney/projects/new"
          className="border-ink bg-lime text-ink cursor-pointer border-[3px] px-4 py-2.5 text-[13px] font-bold shadow-[4px_4px_0_#111]"
        >
          + Add project
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="border-ink box-border overflow-hidden border-[3px] bg-white shadow-[6px_6px_0_#111]"
          >
            <div className="bg-ink flex h-27.5 items-center justify-center overflow-hidden px-3 text-center text-xs font-bold text-white">
              {p.thumbnailUrl ? (
                <Image
                  src={p.thumbnailUrl}
                  alt=""
                  width={400}
                  height={220}
                  sizes="240px"
                  className="h-full w-full object-cover"
                />
              ) : (
                "No thumbnail set"
              )}
            </div>
            <div className="p-4">
              <h3 className="text-ink m-0 mb-1 text-[15px] font-extrabold">{p.title}</h3>
              <p className="text-ink-muted m-0 mb-2.5 text-xs">/{p.slug}</p>
              <p className="text-ink m-0 mb-3 line-clamp-3 text-sm">
                {stripHtmlToText(p.description)}
              </p>
              <div className="mb-3.5 flex flex-wrap gap-1.5">
                {p.techStack.map((tech) => (
                  <span
                    key={tech.id}
                    className="border-ink text-ink border-2 bg-white px-2.25 py-1 text-[11px] font-bold"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/majourney/projects/${p.id}/edit`}
                  className="border-ink text-ink flex-1 cursor-pointer border-[3px] bg-white py-2 text-center text-[13px] font-bold"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  aria-label={`Delete ${p.title}`}
                  disabled={deletingId === p.id}
                  className="border-ink bg-danger flex-1 cursor-pointer border-[3px] py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
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
};

export default ProjectsPage;
