"use client";

import { useId, useRef, useState } from "react";

import { useAdminAuth } from "@/providers/majourney/AdminAuthProvider";
import { uploadImage } from "@/services/admin-uploads";

type ImageUploadFieldProps = {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
};

const ImageUploadField = ({ label, value, onChange, folder }: ImageUploadFieldProps) => {
  const { token } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const labelId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const publicUrl = await uploadImage(file, folder, token);
      onChange(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div role="group" aria-labelledby={labelId}>
      <span id={labelId} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label={`Choose ${label.toLowerCase()} file`}
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          // Arbitrary upload URL: the host is not known at build time.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={`${label} preview`}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 border-[3px] border-ink object-cover"
          />
        ) : null}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer border-[3px] border-ink bg-white px-3 py-2 text-[13px] font-bold text-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          {value && !uploading ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="cursor-pointer border-[3px] border-ink bg-danger px-3 py-2 text-[13px] font-bold text-white"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {error ? (
        <p role="alert" className="m-0 mt-1.5 text-xs font-bold text-danger-text">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default ImageUploadField;
