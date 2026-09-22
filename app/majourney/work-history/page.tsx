"use client";

import { useState } from "react";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminModal from "@/components/majourney/AdminModal";
import { Field, Select, TextArea, TextInput } from "@/components/majourney/FormField";
import ImageUploadField from "@/components/majourney/ImageUploadField";
import { ApiError } from "@/lib/majourney/api-client";
import type { WorkHistoryInput } from "@/lib/majourney/inputs";
import type { WorkHistory, WorkStatus } from "@/lib/api-types";

// The backend's schema enum for work_history.status (confirmed against the
// live AJV validation error — this isn't documented in the Postman
// collection or design doc, only these five values are accepted).
const STATUS_OPTIONS: { value: WorkStatus; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const EMPTY_FORM: WorkHistoryInput = {
  company: "",
  role: "",
  status: "full_time",
  description: "",
  startMonth: 1,
  startYear: new Date().getFullYear(),
  endMonth: null,
  endYear: null,
  companyLogoUrl: null,
};

function toForm(item: WorkHistory): WorkHistoryInput {
  return {
    company: item.company,
    role: item.role,
    status: item.status,
    description: item.description,
    startMonth: item.startMonth,
    startYear: item.startYear,
    endMonth: item.endMonth,
    endYear: item.endYear,
    companyLogoUrl: item.companyLogoUrl,
  };
}

function statusLabel(status: WorkStatus) {
  return STATUS_OPTIONS.find((opt) => opt.value === status)?.label ?? status;
}

function monthYearLabel(month: number, year: number) {
  return `${MONTH_NAMES[month - 1] ?? month} ${year}`;
}

type ModalState = { open: boolean; mode: "add" | "edit"; id?: string; form: WorkHistoryInput };
const EMPTY_MODAL: ModalState = { open: false, mode: "add", form: EMPTY_FORM };

export default function AdminWorkHistoryPage() {
  const { workHistory, createWork, updateWork, deleteWork, errors } = useAdminData();
  const [modal, setModal] = useState<ModalState>(EMPTY_MODAL);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const openAdd = () => {
    setModalError("");
    setModal({ open: true, mode: "add", form: EMPTY_FORM });
  };
  const openEdit = (item: WorkHistory) => {
    setModalError("");
    setModal({ open: true, mode: "edit", id: item.id, form: toForm(item) });
  };
  const close = () => setModal(EMPTY_MODAL);

  const setField = <K extends keyof WorkHistoryInput>(key: K, value: WorkHistoryInput[K]) =>
    setModal((prev) => ({ ...prev, form: { ...prev.form, [key]: value } }));

  const save = async () => {
    setSaving(true);
    setModalError("");
    try {
      if (modal.mode === "add") await createWork(modal.form);
      else await updateWork(modal.id!, modal.form);
      close();
    } catch (err) {
      setModalError(err instanceof ApiError ? err.message : "Could not save work history entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    setActionError("");
    setDeletingId(id);
    try {
      await deleteWork(id);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete work history entry.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {errors.workHistory && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {errors.workHistory}
        </p>
      )}
      {actionError && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={openAdd}
          className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-4 py-2.5 text-[13px] font-bold text-[#111] shadow-[4px_4px_0_#111]"
        >
          + Add work history
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {workHistory.map((w) => (
          <div
            key={w.id}
            className="box-border flex h-full flex-col overflow-hidden border-[3px] border-[#111] bg-white shadow-[6px_6px_0_#111]"
          >
            <div className="flex h-20 shrink-0 items-center justify-center overflow-hidden bg-[#111] px-3 text-center text-xs font-bold text-white">
              {w.companyLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded URL
                <img src={w.companyLogoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                "No logo set"
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="m-0 mb-1 text-[15px] font-extrabold text-[#111]">{w.role}</h3>
              <p className="m-0 mb-2.5 text-xs text-[#555]">
                {w.company} · {statusLabel(w.status)} · {monthYearLabel(w.startMonth, w.startYear)} –{" "}
                {w.endYear ? monthYearLabel(w.endMonth ?? 12, w.endYear) : "Present"}
              </p>
              <p className="m-0 mb-3.5 line-clamp-3 text-sm text-[#111]">{w.description}</p>
              <div className="mt-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(w)}
                  className="flex-1 cursor-pointer border-[3px] border-[#111] bg-white py-2 text-[13px] font-bold text-[#111]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(w.id)}
                  disabled={deletingId === w.id}
                  className="flex-1 cursor-pointer border-[3px] border-[#111] bg-[#ff3b30] py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === w.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        open={modal.open}
        title={(modal.mode === "add" ? "Add " : "Edit ") + "Work History"}
        saving={saving}
        error={modalError}
        onCancel={close}
        onSave={save}
      >
        <Field label="Company">
          <TextInput value={modal.form.company} onChange={(e) => setField("company", e.target.value)} />
        </Field>
        <Field label="Role">
          <TextInput value={modal.form.role} onChange={(e) => setField("role", e.target.value)} />
        </Field>
        <Field label="Status">
          <Select value={modal.form.status} onChange={(e) => setField("status", e.target.value as WorkStatus)}>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="mb-3.5 grid grid-cols-2 gap-2">
          <Field label="Start Month">
            <Select
              value={modal.form.startMonth}
              onChange={(e) => setField("startMonth", Number(e.target.value))}
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx + 1}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Start Year">
            <TextInput
              type="number"
              value={modal.form.startYear}
              onChange={(e) => setField("startYear", Number(e.target.value))}
            />
          </Field>
        </div>
        <div className="mb-3.5 grid grid-cols-2 gap-2">
          <Field label="End Month">
            <Select
              value={modal.form.endMonth ?? ""}
              onChange={(e) => setField("endMonth", e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Present</option>
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx + 1}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="End Year">
            <TextInput
              type="number"
              value={modal.form.endYear ?? ""}
              onChange={(e) => setField("endYear", e.target.value ? Number(e.target.value) : null)}
              placeholder="blank = present"
            />
          </Field>
        </div>
        <div className="mb-3.5">
          <ImageUploadField
            label="Company Logo"
            value={modal.form.companyLogoUrl}
            onChange={(url) => setField("companyLogoUrl", url)}
            folder="work-history"
          />
        </div>
        <Field label="Description">
          <TextArea value={modal.form.description} onChange={(e) => setField("description", e.target.value)} />
        </Field>
      </AdminModal>
    </div>
  );
}
