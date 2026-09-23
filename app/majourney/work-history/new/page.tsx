"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminFormPage from "@/components/majourney/AdminFormPage";
import WorkHistoryForm from "@/components/majourney/WorkHistoryForm";
import { ApiError } from "@/lib/majourney/api-client";
import { EMPTY_FORM } from "@/lib/majourney/work-history";
import type { WorkHistoryInput } from "@/lib/majourney/inputs";

export default function NewWorkHistoryPage() {
  const { createWork } = useAdminData();
  const router = useRouter();
  const [form, setForm] = useState<WorkHistoryInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = <K extends keyof WorkHistoryInput>(key: K, value: WorkHistoryInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await createWork(form);
      router.push("/majourney/work-history");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save work history entry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormPage title="Add Work History" backHref="/majourney/work-history" saving={saving} error={error} onSave={save}>
      <WorkHistoryForm form={form} setField={setField} />
    </AdminFormPage>
  );
}
