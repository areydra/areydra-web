"use client";

import Field from "@/components/ui/Field";
import TextInput from "@/components/ui/TextInput";
import ImageUploadField from "@/components/majourney/ImageUploadField";
import MultiImageUploadField from "@/components/majourney/MultiImageUploadField";
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import type { ProjectInput } from "@/types/admin.types";

type SkillOption = { id: string; name: string; categoryName: string };

interface ProjectFormProps {
  form: ProjectInput;
  setField: <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => void;
  allSkills: SkillOption[];
  onToggleSkill: (skillId: string) => void;
}

export default function ProjectForm({
  form,
  setField,
  allSkills,
  onToggleSkill,
}: ProjectFormProps) {
  return (
    <>
      <Field label="Title">
        <TextInput
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
        />
      </Field>
      <Field label="Role">
        <TextInput
          value={form.role}
          onChange={(e) => setField("role", e.target.value)}
        />
      </Field>
      <Field label="Project Date">
        <TextInput
          type="date"
          value={form.projectDate ?? ""}
          onChange={(e) => setField("projectDate", e.target.value || null)}
        />
      </Field>
      <Field label="GitHub URL">
        <TextInput
          value={form.githubUrl ?? ""}
          onChange={(e) => setField("githubUrl", e.target.value || null)}
        />
      </Field>
      <Field label="Live URL">
        <TextInput
          value={form.liveUrl ?? ""}
          onChange={(e) => setField("liveUrl", e.target.value || null)}
        />
      </Field>
      <Field label="App Store URL">
        <TextInput
          value={form.appStoreUrl ?? ""}
          onChange={(e) => setField("appStoreUrl", e.target.value || null)}
        />
      </Field>
      <Field label="Play Store URL">
        <TextInput
          value={form.playStoreUrl ?? ""}
          onChange={(e) => setField("playStoreUrl", e.target.value || null)}
        />
      </Field>

      <div className="mb-3.5">
        <ImageUploadField
          label="Thumbnail"
          value={form.thumbnailUrl}
          onChange={(url) => setField("thumbnailUrl", url)}
          folder="projects"
        />
      </div>

      <div className="mb-3.5">
        <MultiImageUploadField
          label="Gallery Images"
          values={form.images.map((img) => img.imageUrl)}
          onChange={(urls) =>
            setField(
              "images",
              urls.map((imageUrl, idx) => ({ imageUrl, sortOrder: idx + 1 })),
            )
          }
          folder="projects"
        />
      </div>

      <Field
        label="Tech Stack"
        group
      >
        <div className="border-ink max-h-40 overflow-auto border-[3px] p-2">
          {allSkills.length === 0 && (
            <p className="text-ink-muted m-0 text-xs">No skills yet — add some in Skills first.</p>
          )}
          {allSkills.map((skill) => (
            <label
              key={skill.id}
              className="text-ink flex items-center gap-2 py-1 text-sm"
            >
              <input
                type="checkbox"
                checked={form.skillIds.includes(skill.id)}
                onChange={() => onToggleSkill(skill.id)}
              />
              {skill.name} <span className="text-ink-muted text-xs">({skill.categoryName})</span>
            </label>
          ))}
        </div>
      </Field>

      <Field label="Description">
        <MarkdownEditor
          markdown={form.description}
          className="border-ink border-[3px]"
          onChange={(markdown) => setField("description", markdown)}
        />
      </Field>
    </>
  );
}
