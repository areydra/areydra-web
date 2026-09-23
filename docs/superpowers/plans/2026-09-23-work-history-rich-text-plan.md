# Work History: Rich Text Description + Dedicated Add/Edit Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the work-history add/edit modal with dedicated pages, and make `description` a sanitized rich-text field (Tiptap) instead of a plain textarea.

**Architecture:** Two new routes (`work-history/new`, `work-history/[id]/edit`) reuse the already-loaded `AdminDataContext` list (no new fetch) and a shared `WorkHistoryForm` field set inside a new `AdminFormPage` chrome component. A `RichTextEditor` (Tiptap, constrained extension set) replaces the description `TextArea`. A shared `sanitizeHtml`/`stripHtmlToText` module guards every render site (public homepage + admin list preview) against unsafe HTML, independent of what the editor itself allows.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, `@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/extension-link`, `isomorphic-dompurify`.

**Reference spec:** `docs/superpowers/specs/2026-09-23-work-history-rich-text-design.md`

No automated test suite exists for these admin pages today (confirmed: no test files under `app/majourney`), so this plan does not introduce one (per the spec's explicit "manual testing" decision). Verification per task is `pnpm exec tsc --noEmit` (typecheck) plus, where relevant, a manual check in the running app. Task 11 is a full manual QA pass.

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml` (via `pnpm add`)

- [ ] **Step 1: Install the Tiptap and sanitization packages**

Run:
```bash
pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link isomorphic-dompurify
```
Expected: command exits 0; `package.json`'s `dependencies` now includes all five packages.

- [ ] **Step 2: Verify the project still typechecks**

Run: `pnpm exec tsc --noEmit`
Expected: no errors (nothing references the new packages yet).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml package-lock.json yarn.lock
git commit -m "chore: add tiptap and isomorphic-dompurify dependencies

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Extract shared work-history helpers

**Files:**
- Create: `lib/majourney/work-history.ts`
- Modify: `app/majourney/work-history/page.tsx:1-70` (remove the extracted definitions, import them instead)

This is a pure refactor — behavior must be identical before and after. It exists so the constants/helpers can be reused by the new `new/` and `[id]/edit/` pages and `WorkHistoryForm` without duplication.

- [ ] **Step 1: Create the shared helpers module**

Create `lib/majourney/work-history.ts`:

```ts
import type { WorkHistory, WorkStatus } from "@/lib/api-types";
import type { WorkHistoryInput } from "./inputs";

// The backend's schema enum for work_history.status (confirmed against the
// live AJV validation error — this isn't documented in the Postman
// collection or design doc, only these five values are accepted).
export const STATUS_OPTIONS: { value: WorkStatus; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

export const MONTH_NAMES = [
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

export const EMPTY_FORM: WorkHistoryInput = {
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

export function toForm(item: WorkHistory): WorkHistoryInput {
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

export function statusLabel(status: WorkStatus) {
  return STATUS_OPTIONS.find((opt) => opt.value === status)?.label ?? status;
}

export function monthYearLabel(month: number, year: number) {
  return `${MONTH_NAMES[month - 1] ?? month} ${year}`;
}
```

- [ ] **Step 2: Update `app/majourney/work-history/page.tsx` to import from the new module**

Replace lines 12–70 (the `STATUS_OPTIONS` constant through the `monthYearLabel` function — everything between the imports and the `ModalState` type) with nothing; instead change the import block at the top of the file (lines 1–10) to:

```tsx
"use client";

import { useState } from "react";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminModal from "@/components/majourney/AdminModal";
import { Field, Select, TextArea, TextInput } from "@/components/majourney/FormField";
import ImageUploadField from "@/components/majourney/ImageUploadField";
import { ApiError } from "@/lib/majourney/api-client";
import { EMPTY_FORM, MONTH_NAMES, STATUS_OPTIONS, statusLabel, monthYearLabel, toForm } from "@/lib/majourney/work-history";
import type { WorkHistoryInput } from "@/lib/majourney/inputs";
import type { WorkHistory, WorkStatus } from "@/lib/api-types";
```

The rest of the file (from `type ModalState = ...` onward) is unchanged — it still references `EMPTY_FORM`, `toForm`, `STATUS_OPTIONS`, `MONTH_NAMES`, `statusLabel`, `monthYearLabel`, which now come from the import instead of being defined locally.

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, open `http://localhost:3000/majourney/work-history`, confirm the list renders and Add/Edit modal still works exactly as before (this task changes nothing observable — it's a pure extraction).

- [ ] **Step 4: Commit**

```bash
git add lib/majourney/work-history.ts app/majourney/work-history/page.tsx
git commit -m "refactor: extract work-history form helpers into a shared module

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Add HTML sanitize/strip helpers

**Files:**
- Create: `lib/majourney/html.ts`

- [ ] **Step 1: Create the sanitization module**

Create `lib/majourney/html.ts`:

```ts
import DOMPurify from "isomorphic-dompurify";

// Matches the constrained Tiptap toolbar in RichTextEditor — the editor
// itself can't produce anything outside this set, but we still sanitize at
// every render site (not just at save time), since description is rendered
// to anonymous public visitors and the API could be written to directly,
// bypassing the editor's own constraints.
const ALLOWED_TAGS = ["p", "br", "strong", "em", "s", "ul", "ol", "li", "h3", "blockquote", "a"];
const ALLOWED_ATTR = ["href"];

/** Sanitizes rich-text HTML before rendering it with dangerouslySetInnerHTML. */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^https?:\/\//i,
  });
}

/**
 * Strips all HTML tags for plain-text previews (e.g. the admin list card's
 * line-clamped excerpt). Inserts a space after block-level tags first so
 * "<p>Hello</p><p>World</p>" becomes "Hello World" rather than "HelloWorld".
 */
export function stripHtmlToText(html: string): string {
  const withBreaks = html
    .replace(/<\/(p|li|h3|blockquote)>/gi, "$& ")
    .replace(/<br\s*\/?>/gi, " ");
  const text = DOMPurify.sanitize(withBreaks, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return text.replace(/\s+/g, " ").trim();
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Since there's no test runner in this project, verify the logic directly with `node`:

Run:
```bash
node -e "
const DOMPurify = require('isomorphic-dompurify');
const html = '<p>Hello <strong>world</strong></p><script>alert(1)</script><p>Second</p>';
console.log('sanitized:', DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p','strong'], ALLOWED_ATTR: [] }));
"
```
Expected output: `sanitized: <p>Hello <strong>world</strong></p><p>Second</p>` — the `<script>` tag and its content are gone, `<p>`/`<strong>` remain.

- [ ] **Step 3: Commit**

```bash
git add lib/majourney/html.ts
git commit -m "feat: add HTML sanitize/strip helpers for rich-text description

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Build the RichTextEditor component

**Files:**
- Create: `components/majourney/RichTextEditor.tsx`
- Modify: `app/globals.css` (append rich-text content styles)

- [ ] **Step 1: Add shared rich-text content styles**

Append to the end of `app/globals.css`:

```css
/* Shared styling for rich-text description content — used both by the
   Tiptap editor's contentEditable area and by the sanitized HTML rendered
   on the public homepage, so editing and the published result match. */
.rich-text-content p {
  margin: 0 0 0.75em;
}

.rich-text-content p:last-child {
  margin-bottom: 0;
}

.rich-text-content ul,
.rich-text-content ol {
  margin: 0 0 0.75em;
  padding-left: 1.4em;
}

.rich-text-content li {
  margin-bottom: 0.25em;
}

.rich-text-content h3 {
  margin: 0.75em 0 0.4em;
  font-weight: 800;
}

.rich-text-content blockquote {
  margin: 0 0 0.75em;
  padding-left: 1em;
  border-left: 3px solid #111;
  font-style: italic;
}

.rich-text-content a {
  color: #1410ff;
  text-decoration: underline;
}
```

- [ ] **Step 2: Create the editor component**

Create `components/majourney/RichTextEditor.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";

const EMPTY_HTML = "<p></p>";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

const toolbarButtonClass =
  "cursor-pointer border-[3px] border-[#111] bg-white px-2.5 py-1.5 text-[13px] font-bold text-[#111] disabled:cursor-not-allowed disabled:opacity-40";
const toolbarButtonActiveClass = "bg-[#c8ff00]";

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3] },
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      TiptapLink.configure({
        openOnClick: false,
        protocols: ["http", "https"],
      }),
    ],
    content: value || EMPTY_HTML,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rich-text-content min-h-[140px] px-3 py-2.5 text-sm focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === EMPTY_HTML ? "" : html);
    },
  });

  // Keeps the editor in sync if `value` is replaced from outside after the
  // editor has already mounted (defensive — normally the edit page's form
  // is already hydrated with data by the time this mounts).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const normalizedCurrent = current === EMPTY_HTML ? "" : current;
    if (value !== normalizedCurrent) {
      editor.commands.setContent(value || EMPTY_HTML);
    }
  }, [value, editor]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = window.prompt("Link URL (http:// or https://)", previousUrl || "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className="border-[3px] border-[#111]">
      <div className="flex flex-wrap gap-1.5 border-b-[3px] border-[#111] bg-[#f5f2e8] p-1.5">
        <button
          type="button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("bold") ? toolbarButtonActiveClass : ""}`}
        >
          <span className="font-black">B</span>
        </button>
        <button
          type="button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("italic") ? toolbarButtonActiveClass : ""}`}
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("strike") ? toolbarButtonActiveClass : ""}`}
        >
          <span className="line-through">S</span>
        </button>
        <button
          type="button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${toolbarButtonClass} ${editor?.isActive("heading", { level: 3 }) ? toolbarButtonActiveClass : ""}`}
        >
          H3
        </button>
        <button
          type="button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("bulletList") ? toolbarButtonActiveClass : ""}`}
        >
          • List
        </button>
        <button
          type="button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("orderedList") ? toolbarButtonActiveClass : ""}`}
        >
          1. List
        </button>
        <button
          type="button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("blockquote") ? toolbarButtonActiveClass : ""}`}
        >
          “ Quote
        </button>
        <button
          type="button"
          disabled={!editor}
          onClick={setLink}
          className={`${toolbarButtonClass} ${editor?.isActive("link") ? toolbarButtonActiveClass : ""}`}
        >
          Link
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/majourney/RichTextEditor.tsx app/globals.css
git commit -m "feat: add RichTextEditor component (Tiptap)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Build the AdminFormPage chrome component

**Files:**
- Create: `components/majourney/AdminFormPage.tsx`

This replaces what `AdminModal` did for this flow — back link, title, error banner, Save/Cancel row — but as page chrome instead of an overlay. `AdminModal` itself is untouched and stays in use by projects/blog/skills.

- [ ] **Step 1: Create the component**

Create `components/majourney/AdminFormPage.tsx`:

```tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AdminFormPageProps = {
  title: string;
  backHref: string;
  onSave: () => void;
  saveLabel?: string;
  saving?: boolean;
  error?: string | null;
  children: ReactNode;
};

export default function AdminFormPage({
  title,
  backHref,
  onSave,
  saveLabel = "Save",
  saving = false,
  error,
  children,
}: AdminFormPageProps) {
  return (
    <div>
      <Link href={backHref} className="mb-4 inline-block text-[13px] font-bold text-[#111] underline">
        ← Back to Work History
      </Link>
      <h1 className="m-0 mb-5 text-[19px] font-extrabold text-[#111]">{title}</h1>

      {children}

      {error && <p className="m-0 mt-1 mb-3 text-[13px] font-bold text-[#dc2626]">{error}</p>}

      <div className="mt-4 flex justify-end gap-2.5">
        <Link
          href={backHref}
          className="cursor-pointer border-[3px] border-[#111] bg-white px-4.5 py-2.5 text-center text-sm font-bold text-[#111]"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-4.5 py-2.5 text-sm font-extrabold text-[#111] shadow-[4px_4px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : saveLabel}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/majourney/AdminFormPage.tsx
git commit -m "feat: add AdminFormPage chrome component

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: Build the WorkHistoryForm component

**Files:**
- Create: `components/majourney/WorkHistoryForm.tsx`

- [ ] **Step 1: Create the component**

Create `components/majourney/WorkHistoryForm.tsx`:

```tsx
"use client";

import { Field, Select, TextInput } from "@/components/majourney/FormField";
import ImageUploadField from "@/components/majourney/ImageUploadField";
import RichTextEditor from "@/components/majourney/RichTextEditor";
import { MONTH_NAMES, STATUS_OPTIONS } from "@/lib/majourney/work-history";
import type { WorkHistoryInput } from "@/lib/majourney/inputs";
import type { WorkStatus } from "@/lib/api-types";

type WorkHistoryFormProps = {
  form: WorkHistoryInput;
  setField: <K extends keyof WorkHistoryInput>(key: K, value: WorkHistoryInput[K]) => void;
};

export default function WorkHistoryForm({ form, setField }: WorkHistoryFormProps) {
  return (
    <>
      <Field label="Company">
        <TextInput value={form.company} onChange={(e) => setField("company", e.target.value)} />
      </Field>
      <Field label="Role">
        <TextInput value={form.role} onChange={(e) => setField("role", e.target.value)} />
      </Field>
      <Field label="Status">
        <Select value={form.status} onChange={(e) => setField("status", e.target.value as WorkStatus)}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </Field>
      <div className="mb-3.5 grid grid-cols-2 gap-2">
        <Field label="Start Month">
          <Select value={form.startMonth} onChange={(e) => setField("startMonth", Number(e.target.value))}>
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
            value={form.startYear}
            onChange={(e) => setField("startYear", Number(e.target.value))}
          />
        </Field>
      </div>
      <div className="mb-3.5 grid grid-cols-2 gap-2">
        <Field label="End Month">
          <Select
            value={form.endMonth ?? ""}
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
            value={form.endYear ?? ""}
            onChange={(e) => setField("endYear", e.target.value ? Number(e.target.value) : null)}
            placeholder="blank = present"
          />
        </Field>
      </div>
      <div className="mb-3.5">
        <ImageUploadField
          label="Company Logo"
          value={form.companyLogoUrl}
          onChange={(url) => setField("companyLogoUrl", url)}
          folder="work-history"
        />
      </div>
      <Field label="Description">
        <RichTextEditor value={form.description} onChange={(html) => setField("description", html)} />
      </Field>
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/majourney/WorkHistoryForm.tsx
git commit -m "feat: add shared WorkHistoryForm field set

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: Add the "new" (Add) page

**Files:**
- Create: `app/majourney/work-history/new/page.tsx`

- [ ] **Step 1: Create the page**

Create `app/majourney/work-history/new/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, open `http://localhost:3000/majourney/work-history/new`. Expected: the page renders with the back link, empty form fields, the rich-text toolbar and editor, and a Save/Cancel row. (The list page's Add button still opens the old modal — that's fixed in Task 9.)

- [ ] **Step 3: Commit**

```bash
git add app/majourney/work-history/new/page.tsx
git commit -m "feat: add dedicated 'add work history' page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: Add the "edit" page

**Files:**
- Create: `app/majourney/work-history/[id]/edit/page.tsx`

- [ ] **Step 1: Create the page**

Create `app/majourney/work-history/[id]/edit/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminFormPage from "@/components/majourney/AdminFormPage";
import WorkHistoryForm from "@/components/majourney/WorkHistoryForm";
import { ApiError } from "@/lib/majourney/api-client";
import { toForm } from "@/lib/majourney/work-history";
import type { WorkHistoryInput } from "@/lib/majourney/inputs";

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
        <p className="mb-3 text-sm font-semibold text-[#111]">Work history entry not found.</p>
        <Link href="/majourney/work-history" className="text-[13px] font-bold text-[#111] underline">
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
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormPage title="Edit Work History" backHref="/majourney/work-history" saving={saving} error={error} onSave={save}>
      <WorkHistoryForm form={form} setField={setField} />
    </AdminFormPage>
  );
}
```

Note: `AdminGate` (`components/majourney/AdminGate.tsx`) already renders a global "Loading…" state while `AdminDataContext` is loading, and only renders page children once loading is `false`. So by the time this page mounts, `workHistory` is already populated — the only local edge case this page needs to handle is "no entry with this id" (e.g. a stale/bad link), not a loading state.

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, open `http://localhost:3000/majourney/work-history`, note an existing entry's id from the page (or the network tab), then open `http://localhost:3000/majourney/work-history/<that-id>/edit`. Expected: form pre-filled with that entry's data, including the description rendered as rich text in the editor. Also visit `.../work-history/nonexistent-id/edit`. Expected: "Work history entry not found." message with a back link.

- [ ] **Step 3: Commit**

```bash
git add app/majourney/work-history/\[id\]/edit/page.tsx
git commit -m "feat: add dedicated 'edit work history' page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 9: Simplify the work-history list page

**Files:**
- Modify: `app/majourney/work-history/page.tsx` (full rewrite — removes the modal entirely)

- [ ] **Step 1: Rewrite the page as list-only**

Replace the full contents of `app/majourney/work-history/page.tsx` with:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import { ApiError } from "@/lib/majourney/api-client";
import { stripHtmlToText } from "@/lib/majourney/html";
import { monthYearLabel, statusLabel } from "@/lib/majourney/work-history";

export default function AdminWorkHistoryPage() {
  const { workHistory, deleteWork, errors } = useAdminData();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

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
        <Link
          href="/majourney/work-history/new"
          className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-4 py-2.5 text-[13px] font-bold text-[#111] shadow-[4px_4px_0_#111]"
        >
          + Add work history
        </Link>
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
              <p className="m-0 mb-3.5 line-clamp-3 text-sm text-[#111]">{stripHtmlToText(w.description)}</p>
              <div className="mt-auto flex gap-2">
                <Link
                  href={`/majourney/work-history/${w.id}/edit`}
                  className="flex-1 cursor-pointer border-[3px] border-[#111] bg-white py-2 text-center text-[13px] font-bold text-[#111]"
                >
                  Edit
                </Link>
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
    </div>
  );
}
```

This removes `AdminModal`, `Field`/`Select`/`TextArea`/`TextInput`, `ImageUploadField`, `EMPTY_FORM`/`toForm`/`STATUS_OPTIONS`/`MONTH_NAMES`/`WorkHistoryInput`/`WorkHistory` imports from this file (they're no longer used here — `WorkHistoryForm` uses them now), and the `openAdd`/`openEdit`/`close`/`setField`/`save`/`modal`/`saving`/`modalError` state — none of it is needed once Add/Edit navigate to their own pages.

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors (in particular, no "unused import" issues — all imports in the new file are used).

Run: `pnpm dev`, open `http://localhost:3000/majourney/work-history`. Expected: "+ Add work history" and each card's "Edit" now navigate to the new pages (no modal appears); Delete still works with its confirm dialog; each card's description preview shows plain text (HTML stripped) even for entries with existing plain-text descriptions (stripping plain text is a no-op).

- [ ] **Step 3: Commit**

```bash
git add app/majourney/work-history/page.tsx
git commit -m "refactor: replace work-history add/edit modal with dedicated pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 10: Render sanitized rich text on the public homepage

**Files:**
- Modify: `components/home/WorkHistorySection.tsx:1-10,60`

- [ ] **Step 1: Add the sanitize import**

At the top of `components/home/WorkHistorySection.tsx`, change:

```tsx
import type { WorkHistory } from "@/lib/portfolio-api";
import { anton, archivo, mono } from "@/components/fonts";
import { formatWorkPeriod } from "./formatters";
import { SectionState } from "./SectionState";
```

to:

```tsx
import type { WorkHistory } from "@/lib/portfolio-api";
import { anton, archivo, mono } from "@/components/fonts";
import { sanitizeHtml } from "@/lib/majourney/html";
import { formatWorkPeriod } from "./formatters";
import { SectionState } from "./SectionState";
```

- [ ] **Step 2: Render the description as sanitized HTML**

Replace line 60:

```tsx
              <p style={{ ...archivo, fontSize: "clamp(13px,1.3vw,15px)", fontWeight: 500, lineHeight: 1.6, color: "#111", margin: "12px 0 0" }}>{job.description}</p>
```

with:

```tsx
              <div
                className="rich-text-content"
                style={{ ...archivo, fontSize: "clamp(13px,1.3vw,15px)", fontWeight: 500, lineHeight: 1.6, color: "#111", margin: "12px 0 0" }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
              />
```

`WorkHistorySection` has no `"use client"` directive — it's a Server Component, rendered during SSR in `app/page.tsx`. This is exactly why the design spec chose `isomorphic-dompurify` over plain `dompurify`: plain `dompurify` requires a browser `window` and would throw during server rendering, while `isomorphic-dompurify` falls back to a `jsdom`-backed implementation on the server automatically — no extra setup needed here.

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, open `http://localhost:3000/` and scroll to the Work History section. Expected: existing plain-text descriptions still display correctly (sanitizing plain text is a no-op). Then, in the admin, edit one entry to add a bulleted list, bold text, and a link via the rich text editor, save, and reload the homepage. Expected: the list bullets, bold text, and link render correctly and are styled per the `.rich-text-content` CSS added in Task 4.

- [ ] **Step 4: Commit**

```bash
git add components/home/WorkHistorySection.tsx
git commit -m "feat: render sanitized rich-text work-history description on homepage

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 11: Manual end-to-end QA pass

No files change in this task — it's verification only, covering the spec's acceptance criteria as a whole.

- [ ] **Step 1: Full add/edit/delete flow**

Run: `pnpm dev`, log into `/majourney/login`, go to Work History.
1. Click "+ Add work history" → fill in company/role/status/dates/logo, use the rich text editor to add a bold phrase, a bullet list, and a link (via the Link toolbar button, prompt-entered URL) → Save.
   Expected: redirected to the list; the new card appears with a plain-text (tags stripped) preview of the description.
2. Click "Edit" on that card. Expected: the rich text editor shows the bold text, bullet list, and link exactly as entered. Change something, Save. Expected: redirected to the list, change reflected.
3. Click "Delete" on that card, confirm. Expected: entry removed from the list.

- [ ] **Step 2: XSS defense check**

In the rich text editor, use your browser devtools to check what's actually sent, or more simply: create/edit an entry, and via devtools console run against the live editor instance is unnecessary — instead directly verify the sanitizer using the Task 3 Step 2 `node -e` check (already run), plus this end-to-end check:
1. Temporarily edit an entry's description through the admin API directly (e.g. via `curl` or the browser devtools Network tab replay) to include `<script>alert(1)</script><p>Safe text</p>` in the raw description.
2. Reload the public homepage. Expected: no alert fires, "Safe text" is visible, and viewing page source shows the `<script>` tag is absent from the rendered HTML — confirming the render-time sanitization in Task 10 protects against HTML written directly to the API, not just HTML produced by the editor.
3. Restore the entry to a normal description afterward.

- [ ] **Step 3: Not-found edit route**

Visit `/majourney/work-history/does-not-exist/edit` directly.
Expected: "Work history entry not found." with a working "← Back to Work History" link.

- [ ] **Step 4: Full typecheck and lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: both exit 0.

No commit for this task (verification only). If any step surfaces a bug, fix it as a small follow-up commit referencing the task/step it corresponds to.
