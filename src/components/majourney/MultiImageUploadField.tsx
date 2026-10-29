"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

import { uploadImage } from "@/services/admin-uploads";

interface MultiImageUploadFieldProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  folder: string;
}

const MultiImageUploadField = ({ label, values, onChange, folder }: MultiImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const labelId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) => uploadImage(file, folder)),
      );
      onChange([...values, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => onChange(values.filter((_, current) => current !== index));

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
        multiple
        aria-label={`Choose ${label.toLowerCase()} files`}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      {values.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {values.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative"
            >
              <Image
                src={url}
                alt={`${label} ${index + 1}`}
                width={64}
                height={64}
                sizes="64px"
                className="border-ink h-16 w-16 border-[3px] object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
                className="border-ink bg-danger absolute -top-2 -right-2 h-5 w-5 cursor-pointer border-2 text-xs leading-none text-white"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="border-ink text-ink cursor-pointer border-[3px] bg-white px-3 py-2 text-[13px] font-bold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? "Uploading…" : "+ Add images"}
      </button>
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

export default MultiImageUploadField;
