"use client";

import type { ReactNode } from "react";

type AdminModalProps = {
  open: boolean;
  title: string;
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  saving?: boolean;
  error?: string | null;
  children: ReactNode;
};

export default function AdminModal({
  open,
  title,
  onCancel,
  onSave,
  saveLabel = "Save",
  saving = false,
  error,
  children,
}: AdminModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.5)] p-6">
      <div className="box-border max-h-[85vh] w-full max-w-120 overflow-auto border-4 border-[#111] bg-white p-7 shadow-[10px_10px_0_#111]">
        <h2 className="m-0 mb-5 text-[17px] font-extrabold text-[#111]">{title}</h2>

        {children}

        {error && <p className="m-0 mt-1 mb-2 text-[13px] font-bold text-[#dc2626]">{error}</p>}

        <div className="mt-4 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="cursor-pointer border-[3px] border-[#111] bg-white px-4.5 py-2.5 text-sm font-bold text-[#111] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-4.5 py-2.5 text-sm font-extrabold text-[#111] shadow-[4px_4px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
