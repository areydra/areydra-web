"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AdminFormPageProps = {
  title: string;
  backHref: string;
  backLabel: string;
  onSave: () => void;
  saveLabel?: string;
  saving?: boolean;
  error?: string | null;
  children: ReactNode;
};

const AdminFormPage = ({
  title,
  backHref,
  backLabel,
  onSave,
  saveLabel = "Save",
  saving = false,
  error,
  children,
}: AdminFormPageProps) => {
  return (
    <div>
      <Link href={backHref} className="mb-4 inline-block text-[13px] font-bold text-ink underline">
        ← Back to {backLabel}
      </Link>
      <h1 className="m-0 mb-5 text-[19px] font-extrabold text-ink">{title}</h1>

      {children}

      {error ? (
        <p role="alert" className="m-0 mt-1 mb-3 text-[13px] font-bold text-danger-text">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex justify-end gap-2.5">
        <Link
          href={backHref}
          className="cursor-pointer border-[3px] border-ink bg-white px-4.5 py-2.5 text-center text-sm font-bold text-ink"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="cursor-pointer border-[3px] border-ink bg-lime px-4.5 py-2.5 text-sm font-extrabold text-ink shadow-[4px_4px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : saveLabel}
        </button>
      </div>
    </div>
  );
};

export default AdminFormPage;
