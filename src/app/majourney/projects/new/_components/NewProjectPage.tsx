"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminData } from "@/providers/majourney/AdminDataProvider";
import AdminFormPage from "@/components/majourney/AdminFormPage";
import ProjectForm from "@/components/majourney/ProjectForm";
import { ApiError } from "@/services/admin-api-client";
import { EMPTY_FORM } from "@/lib/project-form";
import type { ProjectInput } from "@/types/admin.types";

export default function NewProjectPage() {
  const { createProject, allSkills } = useAdminData();
  const router = useRouter();
  const [form, setForm] = useState<ProjectInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSkill = (skillId: string) =>
    setForm((prev) => {
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
      await createProject(payload);
      router.push("/majourney/projects");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save project.");
    }
    setSaving(false);
  };

  return (
    <AdminFormPage
      title="Add Project"
      backHref="/majourney/projects"
      backLabel="Projects"
      saving={saving}
      error={error}
      onSave={save}
    >
      <ProjectForm
        form={form}
        setField={setField}
        allSkills={allSkills}
        onToggleSkill={toggleSkill}
      />
    </AdminFormPage>
  );
}
