"use client";

import { useState } from "react";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminModal from "@/components/majourney/AdminModal";
import { Field, TextInput } from "@/components/majourney/FormField";
import { ApiError } from "@/lib/majourney/api-client";

export default function AdminSkillsPage() {
  const { skillGroups, createCategory, deleteCategory, createSkill, deleteSkill, errors } = useAdminData();
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});
  const [addingSkillFor, setAddingSkillFor] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const openAddModal = () => {
    setCategoryName("");
    setModalError("");
    setModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;
    setModalSaving(true);
    setModalError("");
    try {
      await createCategory(categoryName);
      setModalOpen(false);
    } catch (err) {
      setModalError(err instanceof ApiError ? err.message : "Could not create category.");
    } finally {
      setModalSaving(false);
    }
  };

  const handleRemoveCategory = async (id: string) => {
    if (!window.confirm("Delete this category and its skills?")) return;
    setActionError("");
    try {
      await deleteCategory(id);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete category.");
    }
  };

  const handleAddSkill = async (categoryId: string) => {
    const value = (newSkillInputs[categoryId] ?? "").trim();
    if (!value) return;
    setActionError("");
    setAddingSkillFor(categoryId);
    try {
      await createSkill(categoryId, value);
      setNewSkillInputs((prev) => ({ ...prev, [categoryId]: "" }));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not add skill.");
    } finally {
      setAddingSkillFor(null);
    }
  };

  const handleRemoveSkill = async (categoryId: string, skillId: string) => {
    setActionError("");
    try {
      await deleteSkill(categoryId, skillId);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not remove skill.");
    }
  };

  return (
    <div>
      {errors.skills && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {errors.skills}
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
          onClick={openAddModal}
          className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-4 py-2.5 text-[13px] font-bold text-[#111] shadow-[4px_4px_0_#111]"
        >
          + Add category
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {skillGroups.map((cat) => (
          <div
            key={cat.id}
            className="box-border border-[3px] border-[#111] bg-white p-5 shadow-[6px_6px_0_#111]"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="m-0 text-[15px] font-extrabold text-[#111]">{cat.name}</h3>
              <button
                type="button"
                onClick={() => handleRemoveCategory(cat.id)}
                className="cursor-pointer border-none bg-transparent p-0 text-[13px] text-[#111] underline"
              >
                Remove
              </button>
            </div>

            <div className="mb-3 flex gap-1.5">
              <input
                value={newSkillInputs[cat.id] ?? ""}
                onChange={(e) =>
                  setNewSkillInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))
                }
                placeholder="New skill"
                disabled={addingSkillFor === cat.id}
                className="box-border min-w-0 flex-1 border-[3px] border-[#111] px-2.5 py-2 text-[13px] font-[inherit] disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(cat.id)}
                disabled={addingSkillFor === cat.id}
                className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-3 py-2 text-[13px] font-bold text-[#111] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addingSkillFor === cat.id ? "…" : "Add"}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 border-2 border-[#111] bg-white py-[5px] pr-1.5 pl-2.5 text-[13px] font-bold text-[#111]"
                >
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(cat.id, skill.id)}
                    className="cursor-pointer border-none bg-transparent p-0.5 text-[13px] leading-none text-[#111]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        open={modalOpen}
        title="Add Category"
        saving={modalSaving}
        error={modalError}
        onCancel={() => setModalOpen(false)}
        onSave={handleSaveCategory}
      >
        <Field label="Category Name">
          <TextInput value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
        </Field>
      </AdminModal>
    </div>
  );
}
