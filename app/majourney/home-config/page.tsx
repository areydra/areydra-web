"use client";

import { useState } from "react";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import { Field, TextInput } from "@/components/majourney/FormField";
import { ApiError } from "@/lib/majourney/api-client";

export default function AdminHomeConfigPage() {
  const { homeConfig, updateHomeConfig, errors } = useAdminData();
  const isNew = homeConfig === null;
  const [totalShowProjects, setTotalShowProjects] = useState(homeConfig?.totalShowProjects ?? 0);
  const [totalShowBlogs, setTotalShowBlogs] = useState(homeConfig?.totalShowBlogs ?? 0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateHomeConfig({ totalShowProjects, totalShowBlogs });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save home config.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid max-w-[640px] gap-5">
      {errors.homeConfig && (
        <p className="m-0 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {errors.homeConfig}
        </p>
      )}

      <div className="box-border border-[3px] border-[#111] bg-white p-7 shadow-[6px_6px_0_#111]">
        <h2 className="m-0 mb-5 text-lg font-extrabold text-[#111]">Homepage Settings</h2>
        {isNew && !errors.homeConfig && (
          <p className="m-0 mb-5 text-sm text-[#555]">Not set up yet — choose values and save to create it.</p>
        )}

        <Field label="Projects to show on homepage">
          <TextInput
            type="number"
            min={0}
            value={totalShowProjects}
            onChange={(e) => {
              setSaved(false);
              setTotalShowProjects(Number(e.target.value));
            }}
          />
        </Field>
        <Field label="Blog posts to show on homepage">
          <TextInput
            type="number"
            min={0}
            value={totalShowBlogs}
            onChange={(e) => {
              setSaved(false);
              setTotalShowBlogs(Number(e.target.value));
            }}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-5 py-2.5 text-sm font-extrabold text-[#111] shadow-[4px_4px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && !error && <span className="text-sm font-bold text-[#111]">Saved.</span>}
        {error && <span className="text-sm font-bold text-[#dc2626]">{error}</span>}
      </div>
    </div>
  );
}
