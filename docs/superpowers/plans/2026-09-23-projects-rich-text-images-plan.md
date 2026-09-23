# Projects: Rich Text + Image Support (Admin + Public) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring projects admin editing up to the same dedicated-page + rich-text pattern as blog/work-history, and add a new public `/projects/[slug]` detail page linked from the homepage's project cards.

**Architecture:** `RichTextEditor` (folder `"projects"`), the sanitizer, and `AdminFormPage` all already exist unchanged from the blog work — this plan wires them into a new `ProjectForm` + dedicated `new`/`[id]/edit` pages (mirroring blog exactly), then adds one new public page (`getProjectBySlug` + `app/projects/[slug]/page.tsx`) and updates the homepage's `ProjectsSection` to link to it and show a truncated, sanitized preview.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, existing `RichTextEditor`/`sanitizeHtml`/`AdminFormPage` components (no new dependencies).

**Reference spec:** `docs/superpowers/specs/2026-09-23-projects-rich-text-images-design.md`

No automated test suite exists for these pages. Verification per task is `pnpm exec tsc --noEmit` plus, where relevant, a manual/browser check. No backend changes are needed anywhere in this plan — the `"projects"` upload folder and public `GET /projects`/`GET /projects/:slug` endpoints already exist and work.

---

### Task 1: Extract shared project form helpers

**Files:**
- Create: `lib/majourney/projects.ts`

- [ ] **Step 1: Create the module**

Create `lib/majourney/projects.ts`:

```ts
import type { Project } from "@/lib/api-types";
import type { ProjectInput } from "./inputs";

export const EMPTY_FORM: ProjectInput = {
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

export function toForm(item: Project): ProjectInput {
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
```

This is copied verbatim from the current `EMPTY_FORM`/`toForm` already defined at the top of `app/majourney/projects/page.tsx` — a pure extraction, no logic changes.

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/majourney/projects.ts
git commit -m "$(cat <<'EOF'
feat: add shared project form helpers

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

**IMPORTANT:** Use that exact commit message text verbatim, including the `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` line — regardless of which underlying model you are, do not substitute your own model name. Every task in this plan has the same requirement; it will not be repeated in each task below, but it applies to every commit you make.

---

### Task 2: Build the ProjectForm component

**Files:**
- Create: `components/majourney/ProjectForm.tsx`

- [ ] **Step 1: Create the component**

Create `components/majourney/ProjectForm.tsx`:

```tsx
"use client";

import { Field, TextInput } from "@/components/majourney/FormField";
import ImageUploadField from "@/components/majourney/ImageUploadField";
import MultiImageUploadField from "@/components/majourney/MultiImageUploadField";
import RichTextEditor from "@/components/majourney/RichTextEditor";
import type { ProjectInput } from "@/lib/majourney/inputs";

type SkillOption = { id: string; name: string; categoryName: string };

type ProjectFormProps = {
  form: ProjectInput;
  setField: <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => void;
  allSkills: SkillOption[];
  onToggleSkill: (skillId: string) => void;
};

export default function ProjectForm({ form, setField, allSkills, onToggleSkill }: ProjectFormProps) {
  return (
    <>
      <Field label="Title">
        <TextInput value={form.title} onChange={(e) => setField("title", e.target.value)} />
      </Field>
      <Field label="Role">
        <TextInput value={form.role} onChange={(e) => setField("role", e.target.value)} />
      </Field>
      <Field label="Project Date">
        <TextInput
          type="date"
          value={form.projectDate ?? ""}
          onChange={(e) => setField("projectDate", e.target.value || null)}
        />
      </Field>
      <Field label="GitHub URL">
        <TextInput value={form.githubUrl ?? ""} onChange={(e) => setField("githubUrl", e.target.value || null)} />
      </Field>
      <Field label="Live URL">
        <TextInput value={form.liveUrl ?? ""} onChange={(e) => setField("liveUrl", e.target.value || null)} />
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
                checked={form.skillIds.includes(skill.id)}
                onChange={() => onToggleSkill(skill.id)}
              />
              {skill.name} <span className="text-xs text-[#555]">({skill.categoryName})</span>
            </label>
          ))}
        </div>
      </Field>

      <Field label="Description">
        <RichTextEditor value={form.description} onChange={(html) => setField("description", html)} folder="projects" />
      </Field>
    </>
  );
}
```

Every field and its exact styling is copied verbatim from the current `AdminModal` body in `app/majourney/projects/page.tsx`, except the Description field, which now uses `RichTextEditor` (folder `"projects"`) instead of `TextArea`. Skill checkbox toggling (`onToggleSkill`) and the raw `allSkills` list stay as props from the parent page, matching how `save`/`setField` are already organized at the page level for blog/work-history's equivalent forms.

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/majourney/ProjectForm.tsx
git commit -m "$(cat <<'EOF'
feat: add shared ProjectForm field set

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Add the project "new" (Add) page

**Files:**
- Create: `app/majourney/projects/new/page.tsx`

- [ ] **Step 1: Create the page**

Create `app/majourney/projects/new/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminFormPage from "@/components/majourney/AdminFormPage";
import ProjectForm from "@/components/majourney/ProjectForm";
import { ApiError } from "@/lib/majourney/api-client";
import { EMPTY_FORM } from "@/lib/majourney/projects";
import type { ProjectInput } from "@/lib/majourney/inputs";

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
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormPage title="Add Project" backHref="/majourney/projects" backLabel="Projects" saving={saving} error={error} onSave={save}>
      <ProjectForm form={form} setField={setField} allSkills={allSkills} onToggleSkill={toggleSkill} />
    </AdminFormPage>
  );
}
```

The `images` re-indexing in `save()` (assigning `sortOrder` from array position) is copied from the current modal's `save` function verbatim — it keeps gallery image order consistent with however `MultiImageUploadField` left the array.

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, open `http://localhost:3000/majourney/projects/new`. Expected: page renders with the back link ("← Back to Projects"), all fields present (Title/Role/Date/4 URLs/Thumbnail/Gallery/Tech Stack checkboxes/rich text Description with its Image button).

- [ ] **Step 3: Commit**

```bash
git add app/majourney/projects/new/page.tsx
git commit -m "$(cat <<'EOF'
feat: add dedicated 'add project' page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Add the project "edit" page

**Files:**
- Create: `app/majourney/projects/[id]/edit/page.tsx`

- [ ] **Step 1: Create the page**

Create `app/majourney/projects/[id]/edit/page.tsx`:

```tsx
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
```

Same note as blog/work-history's edit pages: `AdminGate` already blocks rendering until `AdminDataContext` finishes loading, so `projects`/`allSkills` are already populated by the time this mounts — the only local edge case is "no project with this id".

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, open `http://localhost:3000/majourney/projects`, note an existing project's id, then open `http://localhost:3000/majourney/projects/<that-id>/edit`. Expected: form pre-filled including tech-stack checkboxes, gallery images, and description as rich text. Also visit `.../projects/nonexistent-id/edit`. Expected: "Project not found." with a back link.

- [ ] **Step 3: Commit**

```bash
git add "app/majourney/projects/[id]/edit/page.tsx"
git commit -m "$(cat <<'EOF'
feat: add dedicated 'edit project' page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Simplify the admin projects list page

**Files:**
- Modify: `app/majourney/projects/page.tsx` (full rewrite — removes the modal entirely)

- [ ] **Step 1: Rewrite the page as list-only**

Replace the full contents of `app/majourney/projects/page.tsx` with:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import { ApiError } from "@/lib/majourney/api-client";
import { stripHtmlToText } from "@/lib/majourney/html";

export default function AdminProjectsPage() {
  const { projects, deleteProject, errors } = useAdminData();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

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
        <Link
          href="/majourney/projects/new"
          className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-4 py-2.5 text-[13px] font-bold text-[#111] shadow-[4px_4px_0_#111]"
        >
          + Add project
        </Link>
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
              <p className="m-0 mb-3 line-clamp-3 text-sm text-[#111]">{stripHtmlToText(p.description)}</p>
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
                <Link
                  href={`/majourney/projects/${p.id}/edit`}
                  className="flex-1 cursor-pointer border-[3px] border-[#111] bg-white py-2 text-center text-[13px] font-bold text-[#111]"
                >
                  Edit
                </Link>
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
    </div>
  );
}
```

This removes `AdminModal`, `Field`/`TextArea`/`TextInput`, `ImageUploadField`, `MultiImageUploadField`, `EMPTY_FORM`/`toForm`/`ProjectInput`/`Project` imports and all modal/form state (`openAdd`/`openEdit`/`close`/`setField`/`toggleSkill`/`save`/`modal`/`saving`/`modalError`) from this file — none of it is needed once Add/Edit navigate to their own pages. The card preview switches from raw `p.description` to `stripHtmlToText(p.description)`.

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors (no unused-import issues).

Run: `pnpm dev`, open `http://localhost:3000/majourney/projects`. Expected: "+ Add project" and each card's "Edit" now navigate to the new pages (no modal appears); Delete still works; each card's description preview shows plain text (HTML stripped).

- [ ] **Step 3: Commit**

```bash
git add app/majourney/projects/page.tsx
git commit -m "$(cat <<'EOF'
refactor: replace project add/edit modal with dedicated pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Add the public project-by-slug API helper

**Files:**
- Modify: `lib/portfolio-api.ts`

- [ ] **Step 1: Add `Project` to the top-level import**

`Project` is not currently imported by name in this file (only used indirectly via `HomeConfig`). Change:

```ts
import type {
  ApiResult,
  BlogPost,
  HomeConfig,
  HomeData,
  ListResponse,
  Profile,
  SkillGroup,
  WorkHistory,
} from "./api-types";
```

to:

```ts
import type {
  ApiResult,
  BlogPost,
  HomeConfig,
  HomeData,
  ListResponse,
  Profile,
  Project,
  SkillGroup,
  WorkHistory,
} from "./api-types";
```

- [ ] **Step 2: Add `getProjectBySlug`**

Add to the end of the file (after `getBlogPostBySlug`, or wherever the file currently ends):

```ts

export async function getProjectBySlug(slug: string): Promise<ApiResult<Project>> {
  return fetchJson<Project>(`/projects/${encodeURIComponent(slug)}`);
}
```

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/portfolio-api.ts
git commit -m "$(cat <<'EOF'
feat: add public project-by-slug API helper

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Add the public project detail page

**Files:**
- Create: `app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create the page**

Create `app/projects/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { StatusStrip } from "@/components/StatusStrip";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { mono, anton, archivo } from "@/components/fonts";
import { sanitizeHtml } from "@/lib/majourney/html";
import { getProjectBySlug } from "@/lib/portfolio-api";

function formatProjectDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en", { month: "short", year: "numeric" });
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: project } = await getProjectBySlug(slug);
  if (!project) notFound();

  const links = [
    project.liveUrl ? { label: "Live", href: project.liveUrl, primary: true } : null,
    project.githubUrl ? { label: "GitHub", href: project.githubUrl, primary: false } : null,
    project.appStoreUrl ? { label: "App Store", href: project.appStoreUrl, primary: false } : null,
    project.playStoreUrl ? { label: "Play Store", href: project.playStoreUrl, primary: false } : null,
  ].filter(Boolean) as { label: string; href: string; primary: boolean }[];

  const sortedImages = project.images.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ background: "#ebe7d9", minHeight: "100vh" }}>
      <StatusStrip />

      <Nav variant="detail" />

      {/* PROJECT HEADER */}
      <section style={{ padding: "clamp(28px,5vw,56px) clamp(24px,5vw,64px)", borderBottom: "4px solid #111", background: "#1410ff" }}>
        {project.role && (
          <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#c8ff00", marginBottom: 16 }}>
            {project.role}
          </div>
        )}
        <h1 style={{ ...anton, fontSize: "clamp(30px,6vw,80px)", lineHeight: "0.95", textTransform: "uppercase", color: "#c8ff00", margin: "0 0 22px", letterSpacing: -1 }}>
          {project.title}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {project.techStack.map((tech) => (
            <span key={tech.id} style={{ ...mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#ebe7d9", border: "2px solid #111", padding: "4px 10px" }}>
              {tech.name}
            </span>
          ))}
        </div>
        <div style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#c8ff00" }}>
          {formatProjectDate(project.projectDate)}
        </div>
        {links.length > 0 && (
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap", border: "3px solid #111", width: "fit-content", marginTop: 22 }}>
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  ...mono,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: link.primary ? "#fff" : "#111",
                  background: link.primary ? "#111" : "#ebe7d9",
                  padding: "12px 22px",
                  textDecoration: "none",
                  borderLeft: index > 0 ? "3px solid #111" : undefined,
                }}
              >
                {link.label} -&gt;
              </a>
            ))}
          </div>
        )}
      </section>

      {/* PROJECT BODY */}
      <section style={{ padding: "clamp(28px,5vw,64px)", maxWidth: 820, margin: "0 auto" }}>
        {sortedImages.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14, marginBottom: 32 }}>
            {sortedImages.map((img) => (
              <div key={img.id} style={{ border: "3px solid #111", boxShadow: "5px 5px 0 #0a0a0a", overflow: "hidden", aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- rendering an arbitrary uploaded gallery image URL */}
                <img src={img.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>
        )}

        <div
          className="rich-text-content"
          style={{ ...archivo, fontSize: "clamp(14px,1.5vw,17px)", fontWeight: 500, lineHeight: 1.8, color: "#111" }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
        />
      </section>

      <Footer subpage />
    </div>
  );
}
```

No `generateStaticParams` — same reasoning as the blog detail page: per-request fetch cached via `fetchJson`'s existing `next: { revalidate: 300 }`, no build-time static param list needed.

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, open `http://localhost:3000/projects/<slug-of-an-existing-project>` (get a real slug from the admin projects list). Expected: header renders role/title/tech-stack/date/links from real data, gallery images (if any) render in a grid, body renders the sanitized rich-text description. Then open `http://localhost:3000/projects/not-a-real-slug`. Expected: Next.js 404.

- [ ] **Step 3: Commit**

```bash
git add "app/projects/[slug]/page.tsx"
git commit -m "$(cat <<'EOF'
feat: add public project detail page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Link homepage project cards to the new detail page

**Files:**
- Modify: `components/home/ProjectsSection.tsx`

- [ ] **Step 1: Add the sanitizer import**

At the top of `components/home/ProjectsSection.tsx`, change:

```tsx
import type { Project } from "@/lib/portfolio-api";
import { anton, archivo, mono } from "@/components/fonts";
import { initials } from "./formatters";
import { SectionState } from "./SectionState";
```

to:

```tsx
import type { Project } from "@/lib/portfolio-api";
import { anton, archivo, mono } from "@/components/fonts";
import { stripHtmlToText } from "@/lib/majourney/html";
import { initials } from "./formatters";
import { SectionState } from "./SectionState";
```

- [ ] **Step 2: Make the title a link, and strip/clamp the description**

The card already renders `ProjectLinks` (Live/GitHub/App Store/Play Store buttons) inside it. Making the *whole card* a link would nest an `<a>` inside another `<a>` — invalid HTML that breaks click targets. So instead, only the title becomes the link to the detail page; the outer card wrapper stays a `<div>`, unchanged.

Change:

```tsx
                <h3 style={{ ...archivo, fontSize: "clamp(16px,1.8vw,21px)", fontWeight: 900, textTransform: "uppercase", color: "#111", margin: "0 0 8px" }}>{project.title}</h3>
```

to:

```tsx
                <a
                  href={`/projects/${project.slug}`}
                  style={{ ...archivo, fontSize: "clamp(16px,1.8vw,21px)", fontWeight: 900, textTransform: "uppercase", color: "#111", margin: "0 0 8px", display: "block", textDecoration: "none" }}
                >
                  {project.title}
                </a>
```

Then change:

```tsx
                <p style={{ ...archivo, fontSize: "clamp(12px,1.2vw,14px)", fontWeight: 500, lineHeight: 1.6, color: "#111", margin: "0 0 14px", flex: 1 }}>{project.description}</p>
```

to:

```tsx
                <p
                  style={{
                    ...archivo,
                    fontSize: "clamp(12px,1.2vw,14px)",
                    fontWeight: 500,
                    lineHeight: 1.6,
                    color: "#111",
                    margin: "0 0 14px",
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {stripHtmlToText(project.description)}
                </p>
```

`ProjectLinks` (used just below, still receiving `project`) needs no change — it doesn't read `description`, and it's no longer at risk of anchor-nesting since the outer wrapper stays a `<div>`.

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, open `http://localhost:3000/`, scroll to "Featured Projects". Expected: each project's title is a working link to `/projects/<slug>`; the description shows as clamped plain text (no raw HTML tags visible even if a project's description contains formatting); the existing Live/GitHub/etc. link row still works independently and isn't nested inside another link.

- [ ] **Step 4: Commit**

```bash
git add components/home/ProjectsSection.tsx
git commit -m "$(cat <<'EOF'
feat: link homepage project cards to the new detail page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Manual end-to-end QA pass

No files change in this task — verification only.

- [ ] **Step 1: Full admin add/edit/delete flow, with images**

Run: `pnpm dev`, log into `/majourney/login`, go to Projects.
1. Add a project with Title/Role/Date/links/Thumbnail/Gallery images/Tech Stack, and in Description: bold text, a bullet list, an uploaded image, and a URL-attached image → Save.
   Expected: redirected to the list; new card appears with a plain-text preview.
2. Edit it: confirm the rich text editor shows everything as entered (including gallery images and tech-stack checkboxes still correct), change something, save.
3. Confirm the public homepage's "Featured Projects" section shows the project with a working title link and clamped description.
4. Visit the project's `/projects/<slug>` page directly: confirm header (role/title/tech stack/date/links), gallery grid, and rich-text body (with both images) all render correctly.
5. Delete a disposable test project afterward if created for this test.

- [ ] **Step 2: Not-found routes**

- Visit `/majourney/projects/does-not-exist/edit` — expect "Project not found." with a working back link.
- Visit `/projects/does-not-exist-slug` — expect a Next.js 404.

- [ ] **Step 3: Full typecheck and lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: `tsc` exits 0. (`pnpm lint` is known-broken repo-wide for unrelated pre-existing reasons — Next 16 removed `next lint` and the repo's ESLint config predates ESLint 10's flat-config requirement — confirmed during the blog feature's QA pass. Don't treat this as a regression to fix; just confirm it fails the same pre-existing way, not a new way.)

No commit for this task. If any step surfaces a genuine bug, fix it as a small follow-up commit referencing the task/step it corresponds to.
