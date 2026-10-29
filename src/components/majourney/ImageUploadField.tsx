"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

import { uploadImage } from "@/lib/admin-uploads";

interface ImageUploadFieldProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
}

const ImageUploadField = ({ label, value, onChange, folder }: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const labelId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const publicUrl = await uploadImage(file, folder);
      onChange(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div
      role="group"
      aria-labelledby={labelId}
    >
      <span
        id={labelId}
        className="text-ink mb-1.5 block text-[13px] font-semibold"
      >
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
          <Image
            src={value}
            alt={`${label} preview`}
            width={64}
            height={64}
            sizes="64px"
            className="border-ink h-16 w-16 shrink-0 border-[3px] object-cover"
          />
        ) : null}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="border-ink text-ink cursor-pointer border-[3px] bg-white px-3 py-2 text-[13px] font-bold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          {value && !uploading ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="border-ink bg-danger cursor-pointer border-[3px] px-3 py-2 text-[13px] font-bold text-white"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {error ? (
        <p
          role="alert"
          className="text-danger-text m-0 mt-1.5 text-xs font-bold"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default ImageUploadField;
