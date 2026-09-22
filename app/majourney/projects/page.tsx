"use client";

import { useState } from "react";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminModal from "@/components/majourney/AdminModal";
import { Field, TextArea, TextInput } from "@/components/majourney/FormField";
import ImageUploadField from "@/components/majourney/ImageUploadField";
import MultiImageUploadField from "@/components/majourney/MultiImageUploadField";
import { ApiError } from "@/lib/majourney/api-client";
import type { ProjectInput } from "@/lib/majourney/inputs";
import type { Project } from "@/lib/api-types";

const EMPTY_FORM: ProjectInput = {
  title: "",
  description: "",
  role: "",
  githubUrl: null,
  liveUrl: null,
  appStoreUrl: null,
  playStoreUrl: null,
  projectDate: null,
  thumbnailUrl: null,
  skillIds: [],
  images: [],
};

function toForm(item: Project): ProjectInput {
  return {
    title: item.title,
    description: item.description,
    role: item.role,
    githubUrl: item.githubUrl,
    liveUrl: item.liveUrl,
    appStoreUrl: item.appStoreUrl,
    playStoreUrl: item.playStoreUrl,
    projectDate: item.projectDate,
    thumbnailUrl: item.thumbnailUrl,
    skillIds: item.techStack.map((t) => t.id),
    images: item.images.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((img) => ({ imageUrl: img.imageUrl, sortOrder: img.sortOrder })),
  };
}

type ModalState = { open: boolean; mode: "add" | "edit"; id?: string; form: ProjectInput };
const EMPTY_MODAL: ModalState = { open: false, mode: "add", form: EMPTY_FORM };

export default function AdminProjectsPage() {
  const { projects, allSkills, createProject, updateProject, deleteProject, errors } = useAdminData();
  const [modal, setModal] = useState<ModalState>(EMPTY_MODAL);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const openAdd = () => {
    setModalError("");
    setModal({ open: true, mode: "add", form: EMPTY_FORM });
  };
  const openEdit = (item: Project) => {
    setModalError("");
    setModal({ open: true, mode: "edit", id: item.id, form: toForm(item) });
  };
  const close = () => setModal(EMPTY_MODAL);

  const setField = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) =>
    setModal((prev) => ({ ...prev, form: { ...prev.form, [key]: value } }));

  const toggleSkill = (skillId: string) =>
    setModal((prev) => {
      const has = prev.form.skillIds.includes(skillId);
      const skillIds = has ? prev.form.skillIds.filter((id) => id !== skillId) : [...prev.form.skillIds, skillId];
      return { ...prev, form: { ...prev.form, skillIds } };
    });

  const save = async () => {
    setSaving(true);
    setModalError("");
    const payload: ProjectInput = {
      ...modal.form,
      images: modal.form.images.map((img, idx) => ({ imageUrl: img.imageUrl, sortOrder: idx + 1 })),
    };
    try {
      if (modal.mode === "add") await createProject(payload);
      else await updateProject(modal.id!, payload);
      close();
    } catch (err) {
      setModalError(err instanceof ApiError ? err.message : "Could not save project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    setActionError("");
    setDeletingId(id);
    try {
      await deleteProject(id);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {errors.projects && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {errors.projects}
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
          + Add project
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="box-border overflow-hidden border-[3px] border-[#111] bg-white shadow-[6px_6px_0_#111]"
          >
            <div className="flex h-[110px] items-center justify-center overflow-hidden bg-[#111] px-3 text-center text-xs font-bold text-white">
              {p.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded URL
                <img src={p.thumbnailUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                "No thumbnail set"
              )}
            </div>
            <div className="p-4">
              <h3 className="m-0 mb-1 text-[15px] font-extrabold text-[#111]">{p.title}</h3>
              <p className="m-0 mb-2.5 text-xs text-[#555]">/{p.slug}</p>
              <p className="m-0 mb-3 line-clamp-3 text-sm text-[#111]">{p.description}</p>
              <div className="mb-3.5 flex flex-wrap gap-1.5">
                {p.techStack.map((tech) => (
                  <span
                    key={tech.id}
                    className="border-2 border-[#111] bg-white px-[9px] py-1 text-[11px] font-bold text-[#111]"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="flex-1 cursor-pointer border-[3px] border-[#111] bg-white py-2 text-[13px] font-bold text-[#111]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="flex-1 cursor-pointer border-[3px] border-[#111] bg-[#ff3b30] py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === p.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        open={modal.open}
        title={(modal.mode === "add" ? "Add " : "Edit ") + "Project"}
        saving={saving}
        error={modalError}
        onCancel={close}
        onSave={save}
      >
        <Field label="Title">
          <TextInput value={modal.form.title} onChange={(e) => setField("title", e.target.value)} />
        </Field>
        <Field label="Role">
          <TextInput value={modal.form.role} onChange={(e) => setField("role", e.target.value)} />
        </Field>
        <Field label="Project Date">
          <TextInput
            type="date"
            value={modal.form.projectDate ?? ""}
            onChange={(e) => setField("projectDate", e.target.value || null)}
          />
        </Field>
        <Field label="GitHub URL">
          <TextInput value={modal.form.githubUrl ?? ""} onChange={(e) => setField("githubUrl", e.target.value || null)} />
        </Field>
        <Field label="Live URL">
          <TextInput value={modal.form.liveUrl ?? ""} onChange={(e) => setField("liveUrl", e.target.value || null)} />
        </Field>
        <Field label="App Store URL">
          <TextInput
            value={modal.form.appStoreUrl ?? ""}
            onChange={(e) => setField("appStoreUrl", e.target.value || null)}
          />
        </Field>
        <Field label="Play Store URL">
          <TextInput
            value={modal.form.playStoreUrl ?? ""}
            onChange={(e) => setField("playStoreUrl", e.target.value || null)}
          />
        </Field>

        <div className="mb-3.5">
          <ImageUploadField
            label="Thumbnail"
            value={modal.form.thumbnailUrl}
            onChange={(url) => setField("thumbnailUrl", url)}
            folder="projects"
          />
        </div>

        <div className="mb-3.5">
          <MultiImageUploadField
            label="Gallery Images"
            values={modal.form.images.map((img) => img.imageUrl)}
            onChange={(urls) => setField("images", urls.map((imageUrl, idx) => ({ imageUrl, sortOrder: idx + 1 })))}
            folder="projects"
          />
        </div>

        <Field label="Tech Stack">
          <div className="max-h-40 overflow-auto border-[3px] border-[#111] p-2">
            {allSkills.length === 0 && <p className="m-0 text-xs text-[#555]">No skills yet — add some in Skills first.</p>}
            {allSkills.map((skill) => (
              <label key={skill.id} className="flex items-center gap-2 py-1 text-sm text-[#111]">
                <input
                  type="checkbox"
                  checked={modal.form.skillIds.includes(skill.id)}
                  onChange={() => toggleSkill(skill.id)}
                />
                {skill.name} <span className="text-xs text-[#555]">({skill.categoryName})</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Description">
          <TextArea value={modal.form.description} onChange={(e) => setField("description", e.target.value)} />
        </Field>
      </AdminModal>
    </div>
  );
}
