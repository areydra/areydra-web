"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useAdminData } from "@/providers/majourney/AdminDataProvider";
import AdminFormPage from "@/components/majourney/AdminFormPage";
import WorkHistoryForm from "@/components/majourney/WorkHistoryForm";
import { ApiError } from "@/services/admin-api-client";
import { toForm } from "@/lib/work-history-form";
import type { WorkHistoryInput } from "@/types/admin.types";

export default function EditWorkHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const { workHistory, updateWork } = useAdminData();
  const router = useRouter();
  const item = workHistory.find((w) => w.id === id);

  const [form, setForm] = useState<WorkHistoryInput | null>(item ? toForm(item) : null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!item || !form) {
    return (
      <div>
        <p className="text-ink mb-3 text-sm font-semibold">Work history entry not found.</p>
        <Link
          href="/majourney/work-history"
          className="text-ink text-[13px] font-bold underline"
        >
          ← Back to Work History
        </Link>
      </div>
    );
  }

  const setField = <K extends keyof WorkHistoryInput>(key: K, value: WorkHistoryInput[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await updateWork(id, form);
      router.push("/majourney/work-history");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save work history entry.");
    }
    setSaving(false);
  };

  return (
    <AdminFormPage
      title="Edit Work History"
      backHref="/majourney/work-history"
      backLabel="Work History"
      saving={saving}
      error={error}
      onSave={save}
    >
      <WorkHistoryForm
        form={form}
        setField={setField}
      />
    </AdminFormPage>
  );
}
