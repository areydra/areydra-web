"use client";

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
      setActionError(err instanceof ApiError ? err.message : "Could not delete work history entry.");
    }
    setDeletingId(null);
  };

  return (
    <div>
      {errors.workHistory && (
        <p className="mb-4 border-[3px] border-ink bg-white p-3 text-[13px] font-bold text-danger-text">
          {errors.workHistory}
        </p>
      )}
      {actionError && (
        <p className="mb-4 border-[3px] border-ink bg-white p-3 text-[13px] font-bold text-danger-text">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex justify-end">
        <Link
          href="/majourney/work-history/new"
          className="cursor-pointer border-[3px] border-ink bg-lime px-4 py-2.5 text-[13px] font-bold text-ink shadow-[4px_4px_0_#111]"
        >
          + Add work history
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {workHistory.map((w) => (
          <div
            key={w.id}
            className="box-border flex h-full flex-col overflow-hidden border-[3px] border-ink bg-white shadow-[6px_6px_0_#111]"
          >
            <div className="flex h-20 shrink-0 items-center justify-center overflow-hidden bg-ink px-3 text-center text-xs font-bold text-white">
              {w.companyLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded URL
                <img src={w.companyLogoUrl} alt="" width={240} height={160} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                "No logo set"
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="m-0 mb-1 text-[15px] font-extrabold text-ink">{w.role}</h3>
              <p className="m-0 mb-2.5 text-xs text-ink-muted">
                {w.company} · {statusLabel(w.status)} · {monthYearLabel(w.startMonth, w.startYear)} –{" "}
                {w.endYear ? monthYearLabel(w.endMonth ?? 12, w.endYear) : "Present"}
              </p>
              <p className="m-0 mb-3.5 line-clamp-3 text-sm text-ink">{stripHtmlToText(w.description)}</p>
              <div className="mt-auto flex gap-2">
                <Link
                  href={`/majourney/work-history/${w.id}/edit`}
                  className="flex-1 cursor-pointer border-[3px] border-ink bg-white py-2 text-center text-[13px] font-bold text-ink"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(w.id)}
                  aria-label={`Delete ${w.role} at ${w.company}`}
                  disabled={deletingId === w.id}
                  className="flex-1 cursor-pointer border-[3px] border-ink bg-danger py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
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
