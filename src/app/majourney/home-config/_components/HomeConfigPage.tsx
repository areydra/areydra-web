"use client";

import { useState } from "react";
import { useAdminData } from "@/providers/majourney/AdminDataProvider";
import Field from "@/components/ui/Field";
import TextInput from "@/components/ui/TextInput";
import { ApiError } from "@/services/admin-api-client";

const HomeConfigPage = () => {
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
    }
    setSaving(false);
  };

  return (
    <div className="grid max-w-160 gap-5">
      {errors.homeConfig && (
        <p className="m-0 border-[3px] border-ink bg-white p-3 text-[13px] font-bold text-danger-text">
          {errors.homeConfig}
        </p>
      )}

      <div className="box-border border-[3px] border-ink bg-white p-7 shadow-[6px_6px_0_#111]">
        <h2 className="m-0 mb-5 text-lg font-extrabold text-ink">Homepage Settings</h2>
        {isNew && !errors.homeConfig && (
          <p className="m-0 mb-5 text-sm text-ink-muted">Not set up yet — choose values and save to create it.</p>
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
          className="cursor-pointer border-[3px] border-ink bg-lime px-5 py-2.5 text-sm font-extrabold text-ink shadow-[4px_4px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && !error && <span className="text-sm font-bold text-ink">Saved.</span>}
        {error && <span className="text-sm font-bold text-danger-text">{error}</span>}
      </div>
    </div>
  );
};

export default HomeConfigPage;
