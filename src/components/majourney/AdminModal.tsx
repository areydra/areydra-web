"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface AdminModalProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  saving?: boolean;
  error?: string | null;
  children: ReactNode;
}

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
    // Backdrop click is a mouse convenience; the keyboard path for dismissing
    // is Escape (onCancel above) plus the visible Cancel button.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
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
      className="border-ink backdrop:bg-overlay m-auto max-h-[85vh] w-full max-w-120 overflow-auto border-4 bg-white p-7 shadow-[10px_10px_0_#111]"
    >
      <h2
        id={titleId}
        className="text-ink m-0 mb-5 text-[17px] font-extrabold"
      >
        {title}
      </h2>

      {children}

      {error ? (
        <p
          role="alert"
          className="text-danger-text m-0 mt-1 mb-2 text-[13px] font-bold"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="border-ink text-ink cursor-pointer border-[3px] bg-white px-4.5 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="border-ink bg-lime text-ink cursor-pointer border-[3px] px-4.5 py-2.5 text-sm font-extrabold shadow-[4px_4px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : saveLabel}
        </button>
      </div>
    </dialog>
  );
};

export default AdminModal;
