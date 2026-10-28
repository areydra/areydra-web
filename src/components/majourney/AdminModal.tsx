"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

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

/**
 * Native `<dialog>`: focus trapping, Escape handling and focus restoration come
 * from the platform instead of hand-rolled listeners.
 */
const AdminModal = ({
  open,
  title,
  onCancel,
  onSave,
  saveLabel = "Save",
  saving = false,
  error,
  children,
}: AdminModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(
    function syncDialogOpenState() {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open && !dialog.open) dialog.showModal();
      if (!open && dialog.open) dialog.close();
    },
    [open],
  );

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Escape closes the dialog natively; route it through the owner so its
        // state stays the source of truth.
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      className="m-auto max-h-[85vh] w-full max-w-120 overflow-auto border-4 border-ink bg-white p-7 shadow-[10px_10px_0_#111] backdrop:bg-overlay"
    >
      <h2 id={titleId} className="m-0 mb-5 text-[17px] font-extrabold text-ink">
        {title}
      </h2>

      {children}

      {error ? (
        <p role="alert" className="m-0 mt-1 mb-2 text-[13px] font-bold text-danger-text">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="cursor-pointer border-[3px] border-ink bg-white px-4.5 py-2.5 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="cursor-pointer border-[3px] border-ink bg-lime px-4.5 py-2.5 text-sm font-extrabold text-ink shadow-[4px_4px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : saveLabel}
        </button>
      </div>
    </dialog>
  );
};

export default AdminModal;
