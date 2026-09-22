"use client";

import { useRef, useState } from "react";
import { useAdminAuth } from "@/contexts/majourney/AdminAuthContext";
import { uploadImage } from "@/lib/majourney/uploads";

type MultiImageUploadFieldProps = {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  folder: string;
};

export default function MultiImageUploadField({ label, values, onChange, folder }: MultiImageUploadFieldProps) {
  const { token } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const uploaded = await Promise.all(Array.from(files).map((file) => uploadImage(file, folder, token)));
      onChange([...values, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (idx: number) => onChange(values.filter((_, i) => i !== idx));

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#111]">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {values.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {values.map((url, idx) => (
            <div key={`${url}-${idx}`} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded URL */}
              <img src={url} alt="" className="h-16 w-16 border-[3px] border-[#111] object-cover" />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute -top-2 -right-2 h-5 w-5 cursor-pointer border-2 border-[#111] bg-[#ff3b30] text-xs leading-none text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer border-[3px] border-[#111] bg-white px-3 py-2 text-[13px] font-bold text-[#111] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? "Uploading…" : "+ Add images"}
      </button>
      {error && <p className="m-0 mt-1.5 text-xs font-bold text-[#dc2626]">{error}</p>}
    </div>
  );
}
