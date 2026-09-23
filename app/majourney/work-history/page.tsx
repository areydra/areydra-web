"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import { ApiError } from "@/lib/majourney/api-client";
import { stripHtmlToText } from "@/lib/majourney/html";
import { monthYearLabel, statusLabel } from "@/lib/majourney/work-history";

export default function AdminWorkHistoryPage() {
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
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {errors.workHistory && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {errors.workHistory}
        </p>
      )}
      {actionError && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex justify-end">
        <Link
          href="/majourney/work-history/new"
          className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-4 py-2.5 text-[13px] font-bold text-[#111] shadow-[4px_4px_0_#111]"
        >
          + Add work history
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {workHistory.map((w) => (
          <div
            key={w.id}
            className="box-border flex h-full flex-col overflow-hidden border-[3px] border-[#111] bg-white shadow-[6px_6px_0_#111]"
          >
            <div className="flex h-20 shrink-0 items-center justify-center overflow-hidden bg-[#111] px-3 text-center text-xs font-bold text-white">
              {w.companyLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded URL
                <img src={w.companyLogoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                "No logo set"
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="m-0 mb-1 text-[15px] font-extrabold text-[#111]">{w.role}</h3>
              <p className="m-0 mb-2.5 text-xs text-[#555]">
                {w.company} · {statusLabel(w.status)} · {monthYearLabel(w.startMonth, w.startYear)} –{" "}
                {w.endYear ? monthYearLabel(w.endMonth ?? 12, w.endYear) : "Present"}
              </p>
              <p className="m-0 mb-3.5 line-clamp-3 text-sm text-[#111]">{stripHtmlToText(w.description)}</p>
              <div className="mt-auto flex gap-2">
                <Link
                  href={`/majourney/work-history/${w.id}/edit`}
                  className="flex-1 cursor-pointer border-[3px] border-[#111] bg-white py-2 text-center text-[13px] font-bold text-[#111]"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(w.id)}
                  disabled={deletingId === w.id}
                  className="flex-1 cursor-pointer border-[3px] border-[#111] bg-[#ff3b30] py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
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
}
