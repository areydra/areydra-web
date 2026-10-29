"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

import { useAdminData } from "@/providers/majourney/AdminDataProvider";
import { ApiError } from "@/services/admin-api-client";
import { stripHtmlToText } from "@/lib/strip-html";
import { monthYearLabel, statusLabel } from "@/lib/work-history-form";

const WorkHistoryPage = () => {
  const { workHistory, deleteWork, errors } = useAdminData();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    setActionError("");
    setDeletingId(id);
    try {
      await deleteWork(id);
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Could not delete work history entry.",
      );
    }
    setDeletingId(null);
  };

  return (
    <div>
      {errors.workHistory && (
        <p className="border-ink text-danger-text mb-4 border-[3px] bg-white p-3 text-[13px] font-bold">
          {errors.workHistory}
        </p>
      )}
      {actionError && (
        <p className="border-ink text-danger-text mb-4 border-[3px] bg-white p-3 text-[13px] font-bold">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex justify-end">
        <Link
          href="/majourney/work-history/new"
          className="border-ink bg-lime text-ink cursor-pointer border-[3px] px-4 py-2.5 text-[13px] font-bold shadow-[4px_4px_0_#111]"
        >
          + Add work history
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {workHistory.map((w) => (
          <div
            key={w.id}
            className="border-ink box-border flex h-full flex-col overflow-hidden border-[3px] bg-white shadow-[6px_6px_0_#111]"
          >
            <div className="bg-ink flex h-20 shrink-0 items-center justify-center overflow-hidden px-3 text-center text-xs font-bold text-white">
              {w.companyLogoUrl ? (
                <Image
                  src={w.companyLogoUrl}
                  alt=""
                  width={240}
                  height={160}
                  sizes="240px"
                  className="h-full w-full object-cover"
                />
              ) : (
                "No logo set"
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-ink m-0 mb-1 text-[15px] font-extrabold">{w.role}</h3>
              <p className="text-ink-muted m-0 mb-2.5 text-xs">
                {w.company} · {statusLabel(w.status)} · {monthYearLabel(w.startMonth, w.startYear)}{" "}
                – {w.endYear ? monthYearLabel(w.endMonth ?? 12, w.endYear) : "Present"}
              </p>
              <p className="text-ink m-0 mb-3.5 line-clamp-3 text-sm">
                {stripHtmlToText(w.description)}
              </p>
              <div className="mt-auto flex gap-2">
                <Link
                  href={`/majourney/work-history/${w.id}/edit`}
                  className="border-ink text-ink flex-1 cursor-pointer border-[3px] bg-white py-2 text-center text-[13px] font-bold"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(w.id)}
                  aria-label={`Delete ${w.role} at ${w.company}`}
                  disabled={deletingId === w.id}
                  className="border-ink bg-danger flex-1 cursor-pointer border-[3px] py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === w.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkHistoryPage;
