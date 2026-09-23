"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminFormPage from "@/components/majourney/AdminFormPage";
import ProjectForm from "@/components/majourney/ProjectForm";
import { ApiError } from "@/lib/majourney/api-client";
import { toForm } from "@/lib/majourney/projects";
import type { ProjectInput } from "@/lib/majourney/inputs";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { projects, allSkills, updateProject } = useAdminData();
  const router = useRouter();
  const item = projects.find((p) => p.id === id);

  const [form, setForm] = useState<ProjectInput | null>(item ? toForm(item) : null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!item || !form) {
    return (
      <div>
        <p className="mb-3 text-sm font-semibold text-[#111]">Project not found.</p>
        <Link href="/majourney/projects" className="text-[13px] font-bold text-[#111] underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const setField = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const toggleSkill = (skillId: string) =>
    setForm((prev) => {
      if (!prev) return prev;
      const has = prev.skillIds.includes(skillId);
      const skillIds = has ? prev.skillIds.filter((id) => id !== skillId) : [...prev.skillIds, skillId];
      return { ...prev, skillIds };
    });

  const save = async () => {
    setSaving(true);
    setError("");
    const payload: ProjectInput = {
      ...form,
      images: form.images.map((img, idx) => ({ imageUrl: img.imageUrl, sortOrder: idx + 1 })),
    };
    try {
      await updateProject(id, payload);
      router.push("/majourney/projects");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormPage title="Edit Project" backHref="/majourney/projects" backLabel="Projects" saving={saving} error={error} onSave={save}>
      <ProjectForm form={form} setField={setField} allSkills={allSkills} onToggleSkill={toggleSkill} />
    </AdminFormPage>
  );
}
