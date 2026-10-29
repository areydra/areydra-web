"use client";

import { useState } from "react";

import { useAdminData } from "@/providers/majourney/AdminDataProvider";
import AdminModal from "@/components/majourney/AdminModal";
import Field from "@/components/ui/Field";
import TextInput from "@/components/ui/TextInput";
import { ApiError } from "@/lib/admin-api-client";

const SkillsPage = () => {
  const { skillGroups, createCategory, deleteCategory, createSkill, deleteSkill, errors } =
    useAdminData();
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
    }
    setModalSaving(false);
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
    }
    setAddingSkillFor(null);
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
        <p className="border-ink text-danger-text mb-4 border-[3px] bg-white p-3 text-[13px] font-bold">
          {errors.skills}
        </p>
      )}
      {actionError && (
        <p className="border-ink text-danger-text mb-4 border-[3px] bg-white p-3 text-[13px] font-bold">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={openAddModal}
          className="border-ink bg-lime text-ink cursor-pointer border-[3px] px-4 py-2.5 text-[13px] font-bold shadow-[4px_4px_0_var(--color-ink)]"
        >
          + Add category
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {skillGroups.map((cat) => (
          <div
            key={cat.id}
            className="border-ink box-border border-[3px] bg-white p-5 shadow-[6px_6px_0_var(--color-ink)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-ink m-0 text-[15px] font-extrabold">{cat.name}</h3>
              <button
                type="button"
                onClick={() => handleRemoveCategory(cat.id)}
                aria-label={`Delete category ${cat.name}`}
                className="text-ink cursor-pointer border-none bg-transparent p-0 text-[13px] underline"
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
                aria-label={`New skill for ${cat.name}`}
                disabled={addingSkillFor === cat.id}
                className="border-ink box-border min-w-0 flex-1 border-[3px] px-2.5 py-2 font-[inherit] text-[13px] disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(cat.id)}
                disabled={addingSkillFor === cat.id}
                className="border-ink bg-lime text-ink cursor-pointer border-[3px] px-3 py-2 text-[13px] font-bold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addingSkillFor === cat.id ? "…" : "Add"}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="border-ink text-ink inline-flex items-center gap-1.5 border-2 bg-white py-1.25 pr-1.5 pl-2.5 text-[13px] font-bold"
                >
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(cat.id, skill.id)}
                    aria-label={`Remove ${skill.name}`}
                    className="text-ink cursor-pointer border-none bg-transparent p-0.5 text-[13px] leading-none"
                  >
                    <span aria-hidden="true">×</span>
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
          <TextInput
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Field>
      </AdminModal>
    </div>
  );
};

export default SkillsPage;
