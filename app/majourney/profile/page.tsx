"use client";

import { useState } from "react";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import { Field, TextArea, TextInput } from "@/components/majourney/FormField";
import ImageUploadField from "@/components/majourney/ImageUploadField";
import { ApiError } from "@/lib/majourney/api-client";
import type { ProfileInput } from "@/lib/majourney/inputs";
import type { Profile } from "@/lib/api-types";

const EMPTY_INPUT: ProfileInput = {
  name: "",
  role: "",
  tagline: "",
  avatarUrl: null,
  aboutTitle: "",
  aboutDescription: "",
  aboutPoints: [],
  github: null,
  linkedin: null,
  email: null,
  phone: null,
  location: null,
};

function toInput(profile: Profile): ProfileInput {
  return {
    name: profile.name,
    role: profile.role,
    tagline: profile.tagline,
    avatarUrl: profile.avatarUrl,
    aboutTitle: profile.aboutTitle,
    aboutDescription: profile.aboutDescription,
    aboutPoints: profile.aboutPoints
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((pt) => ({ title: pt.title, description: pt.description, sortOrder: pt.sortOrder })),
    github: profile.github,
    linkedin: profile.linkedin,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
  };
}

export default function AdminProfilePage() {
  const { profile, updateProfile, errors } = useAdminData();
  // `profile` is null both while a real load error occurred (see `errors.profile`
  // below) and, normally, when the singleton profile row simply hasn't been
  // created yet — either way the form still opens, starting from a blank draft.
  const [draft, setDraft] = useState<ProfileInput>(() => (profile ? toInput(profile) : EMPTY_INPUT));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const isNew = profile === null;

  const set = <K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) => {
    setSaved(false);
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const addAboutPoint = () =>
    set("aboutPoints", [...draft.aboutPoints, { title: "", description: "", sortOrder: draft.aboutPoints.length + 1 }]);
  const updateAboutPoint = (idx: number, key: "title" | "description", value: string) =>
    set(
      "aboutPoints",
      draft.aboutPoints.map((pt, i) => (i === idx ? { ...pt, [key]: value } : pt))
    );
  const removeAboutPoint = (idx: number) => {
    if (!window.confirm("Remove this about point?")) return;
    set(
      "aboutPoints",
      draft.aboutPoints.filter((_, i) => i !== idx).map((pt, i) => ({ ...pt, sortOrder: i + 1 }))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateProfile(draft);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid max-w-[640px] gap-5">
      {errors.profile && (
        <p className="m-0 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {errors.profile}
        </p>
      )}

      <div className="box-border border-[3px] border-[#111] bg-white p-7 shadow-[6px_6px_0_#111]">
        <h2 className="m-0 mb-5 text-lg font-extrabold text-[#111]">Profile</h2>
        {isNew && !errors.profile && (
          <p className="m-0 mb-5 text-sm text-[#555]">No profile yet — fill this in and save to create it.</p>
        )}

        <Field label="Name">
          <TextInput value={draft.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Role">
          <TextInput value={draft.role} onChange={(e) => set("role", e.target.value)} />
        </Field>
        <Field label="Tagline">
          <TextInput value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="About Title">
          <TextInput value={draft.aboutTitle} onChange={(e) => set("aboutTitle", e.target.value)} />
        </Field>
        <Field label="About Description">
          <TextArea value={draft.aboutDescription} onChange={(e) => set("aboutDescription", e.target.value)} />
        </Field>
        <Field label="GitHub URL">
          <TextInput value={draft.github ?? ""} onChange={(e) => set("github", e.target.value || null)} />
        </Field>
        <Field label="LinkedIn URL">
          <TextInput value={draft.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value || null)} />
        </Field>
        <Field label="Email">
          <TextInput value={draft.email ?? ""} onChange={(e) => set("email", e.target.value || null)} />
        </Field>
        <Field label="Phone">
          <TextInput value={draft.phone ?? ""} onChange={(e) => set("phone", e.target.value || null)} />
        </Field>
        <Field label="Location">
          <TextInput value={draft.location ?? ""} onChange={(e) => set("location", e.target.value || null)} />
        </Field>

        <ImageUploadField
          label="Avatar"
          value={draft.avatarUrl}
          onChange={(url) => set("avatarUrl", url)}
          folder="profile"
        />
      </div>

      <div className="box-border border-[3px] border-[#111] bg-white p-7 shadow-[6px_6px_0_#111]">
        <h2 className="m-0 mb-5 text-lg font-extrabold text-[#111]">About Points</h2>
        {draft.aboutPoints.map((point, idx) => (
          <div key={idx} className="mb-2.5 flex gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <TextInput
                value={point.title}
                onChange={(e) => updateAboutPoint(idx, "title", e.target.value)}
                placeholder="Title"
              />
              <TextInput
                value={point.description}
                onChange={(e) => updateAboutPoint(idx, "description", e.target.value)}
                placeholder="Description"
              />
            </div>
            <button
              type="button"
              onClick={() => removeAboutPoint(idx)}
              className="h-fit w-9 shrink-0 cursor-pointer border-[3px] border-[#111] bg-[#ff3b30] text-base text-white"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addAboutPoint}
          className="cursor-pointer border-[3px] border-dashed border-[#111] bg-white px-3.5 py-2 text-[13px] font-bold text-[#111]"
        >
          + Add point
        </button>
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
