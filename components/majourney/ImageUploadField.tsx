"use client";

import { useRef, useState } from "react";
import { useAdminAuth } from "@/contexts/majourney/AdminAuthContext";
import { uploadImage } from "@/lib/majourney/uploads";

type ImageUploadFieldProps = {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
};

export default function ImageUploadField({ label, value, onChange, folder }: ImageUploadFieldProps) {
  const { token } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
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
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#111]">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="flex flex-wrap items-center gap-3">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded URL
          <img
            src={value}
            alt=""
            className="h-16 w-16 shrink-0 border-[3px] border-[#111] object-cover"
          />
        )}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer border-[3px] border-[#111] bg-white px-3 py-2 text-[13px] font-bold text-[#111] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="cursor-pointer border-[3px] border-[#111] bg-[#ff3b30] px-3 py-2 text-[13px] font-bold text-white"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="m-0 mt-1.5 text-xs font-bold text-[#dc2626]">{error}</p>}
    </div>
  );
}
