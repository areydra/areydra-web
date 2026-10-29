"use client";

import Link from "next/link";

import type { ReactNode } from "react";

interface AdminFormPageProps {
  title: string;
  backHref: string;
  backLabel: string;
  onSave: () => void;
  saveLabel?: string;
  saving?: boolean;
  error?: string | null;
  children: ReactNode;
}

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
      <Link
        href={backHref}
        className="text-ink mb-4 inline-block text-[13px] font-bold underline"
      >
        ← Back to {backLabel}
      </Link>
      <h1 className="text-ink m-0 mb-5 text-[19px] font-extrabold">{title}</h1>

      {children}

      {error ? (
        <p
          role="alert"
          className="text-danger-text m-0 mt-1 mb-3 text-[13px] font-bold"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex justify-end gap-2.5">
        <Link
          href={backHref}
          className="border-ink text-ink cursor-pointer border-[3px] bg-white px-4.5 py-2.5 text-center text-sm font-bold"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="border-ink bg-lime text-ink cursor-pointer border-[3px] px-4.5 py-2.5 text-sm font-extrabold shadow-[4px_4px_0_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : saveLabel}
        </button>
      </div>
    </div>
  );
};

export default AdminFormPage;
