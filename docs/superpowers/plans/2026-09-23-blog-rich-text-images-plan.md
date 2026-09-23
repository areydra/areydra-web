# Blog: Rich Text + Image Support (Admin + Public) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring blog admin editing up to the same dedicated-page + rich-text pattern as work-history, add image support (upload or attach-by-URL) to the shared rich text editor, and wire the public blog pages to the real API so real posts with real embedded images are actually visible to visitors.

**Architecture:** `RichTextEditor` (already built for work-history) gains a generic `folder` prop and an Image toolbar button (upload via the existing R2 presign flow, or attach by URL), reused unchanged by both work-history and blog. Blog admin gets the same `new`/`[id]/edit` dedicated-page split work-history already has, via a new `BlogPostForm` + extracted `lib/majourney/blog.ts` helpers. The sanitizer allowlist (`lib/majourney/html.ts`) is extended to permit `img`. The public `/blog` and `/blog/[slug]` pages, currently rendering mock data, switch to two new `lib/portfolio-api.ts` functions backed by the backend's existing public `GET /blog` / `GET /blog/:slug` endpoints, rendering real content through the same `sanitizeHtml`/`.rich-text-content` convention already used for work-history on the homepage.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, `@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/extension-image`, `isomorphic-dompurify`.

**Reference spec:** `docs/superpowers/specs/2026-09-23-blog-rich-text-images-design.md`

No automated test suite exists for these pages today. Verification per task is `pnpm exec tsc --noEmit` (typecheck) plus, where relevant, a manual check in the running app (`pnpm dev`). Task 13 is a full manual QA pass. No backend (`areydra-be`) changes are needed anywhere in this plan.

---

### Task 1: Install `@tiptap/extension-image`

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock` (via `pnpm add`)

- [ ] **Step 1: Install the package, pinned to the same version as the rest of the Tiptap suite**

The repo's existing Tiptap packages (`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`) are all pinned to `^3.31.3` — pin this one the same way so all Tiptap packages stay on matching majors (mismatched Tiptap extension/core versions can throw at runtime).

Run:
```bash
pnpm add @tiptap/extension-image@^3.31.3
```
Expected: command exits 0; `package.json`'s `dependencies` now includes `"@tiptap/extension-image": "^3.31.3"`.

- [ ] **Step 2: Verify the project still typechecks**

Run: `pnpm exec tsc --noEmit`
Expected: no errors (nothing references the new package yet).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml package-lock.json yarn.lock
git commit -m "$(cat <<'EOF'
chore: add @tiptap/extension-image dependency

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Add image support to RichTextEditor (upload + URL), update its one caller

**Files:**
- Modify: `components/majourney/RichTextEditor.tsx` (full rewrite)
- Modify: `components/majourney/WorkHistoryForm.tsx:82-84` (pass the new required `folder` prop)
- Modify: `app/globals.css` (append `img` styling to `.rich-text-content`)

`RichTextEditor` is shared by work-history and (starting in Task 6) blog. It gets a new required `folder: string` prop — the R2 upload folder to use, same value `ImageUploadField` already takes (`"work-history"`, `"blog"`, etc.) — so the image upload button knows where to put files. Since this makes `folder` required, `WorkHistoryForm.tsx` (today's only caller) must be updated in the same commit to keep the tree compiling.

- [ ] **Step 1: Add `img` styling to the shared rich-text CSS**

In `app/globals.css`, find this block (added when `RichTextEditor` was first built):

```css
.rich-text-content a {
  color: #1410ff;
  text-decoration: underline;
}
```

Add immediately after it:

```css

.rich-text-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0.75em 0;
}
```

- [ ] **Step 2: Rewrite `RichTextEditor.tsx` with image support**

Replace the full contents of `components/majourney/RichTextEditor.tsx` with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import { useAdminAuth } from "@/contexts/majourney/AdminAuthContext";
import { uploadImage } from "@/lib/majourney/uploads";

const EMPTY_HTML = "<p></p>";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  /** R2 upload folder for images inserted via the toolbar's "Upload file" option (e.g. "work-history", "blog"). */
  folder: string;
};

const toolbarButtonClass =
  "cursor-pointer border-[3px] border-[#111] bg-white px-2.5 py-1.5 text-[13px] font-bold text-[#111] disabled:cursor-not-allowed disabled:opacity-40";
const toolbarButtonActiveClass = "bg-[#c8ff00]";

export default function RichTextEditor({ value, onChange, folder }: RichTextEditorProps) {
  const { token } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageMenuOpen, setImageMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3] },
        codeBlock: false,
        code: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          protocols: ["http", "https"],
        },
      }),
      TiptapImage,
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

  const insertImageFromUrl = () => {
    setImageMenuOpen(false);
    if (!editor) return;
    const url = window.prompt("Image URL (http:// or https://)", "https://");
    if (!url || url.trim() === "") return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const openFilePicker = () => {
    setImageMenuOpen(false);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (file: File | undefined) => {
    if (!file || !editor) return;
    setUploadError("");
    setUploading(true);
    try {
      const publicUrl = await uploadImage(file, folder, token);
      editor.chain().focus().setImage({ src: publicUrl }).run();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="border-[3px] border-[#111]">
        <div className="flex flex-wrap gap-1.5 border-b-[3px] border-[#111] bg-[#f5f2e8] p-1.5">
          <button
            type="button"
            disabled={!editor}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`${toolbarButtonClass} ${editor?.isActive("bold") ? toolbarButtonActiveClass : ""}`}
          >
            <span className="font-black">B</span>
          </button>
          <button
            type="button"
            disabled={!editor}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`${toolbarButtonClass} ${editor?.isActive("italic") ? toolbarButtonActiveClass : ""}`}
          >
            <span className="italic">I</span>
          </button>
          <button
            type="button"
            disabled={!editor}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`${toolbarButtonClass} ${editor?.isActive("strike") ? toolbarButtonActiveClass : ""}`}
          >
            <span className="line-through">S</span>
          </button>
          <button
            type="button"
            disabled={!editor}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`${toolbarButtonClass} ${editor?.isActive("heading", { level: 3 }) ? toolbarButtonActiveClass : ""}`}
          >
            H3
          </button>
          <button
            type="button"
            disabled={!editor}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`${toolbarButtonClass} ${editor?.isActive("bulletList") ? toolbarButtonActiveClass : ""}`}
          >
            • List
          </button>
          <button
            type="button"
            disabled={!editor}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`${toolbarButtonClass} ${editor?.isActive("orderedList") ? toolbarButtonActiveClass : ""}`}
          >
            1. List
          </button>
          <button
            type="button"
            disabled={!editor}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`${toolbarButtonClass} ${editor?.isActive("blockquote") ? toolbarButtonActiveClass : ""}`}
          >
            “ Quote
          </button>
          <button
            type="button"
            disabled={!editor}
            onMouseDown={(e) => e.preventDefault()}
            onClick={setLink}
            className={`${toolbarButtonClass} ${editor?.isActive("link") ? toolbarButtonActiveClass : ""}`}
          >
            Link
          </button>
          <div className="relative">
            <button
              type="button"
              disabled={!editor || uploading}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setImageMenuOpen((open) => !open)}
              className={toolbarButtonClass}
            >
              {uploading ? "Uploading…" : "Image"}
            </button>
            {imageMenuOpen && (
              <div className="absolute top-full left-0 z-10 mt-1 flex flex-col border-[3px] border-[#111] bg-white shadow-[4px_4px_0_#111]">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={openFilePicker}
                  className="cursor-pointer border-b-[2px] border-[#111] px-3 py-2 text-left text-[13px] font-bold whitespace-nowrap text-[#111] hover:bg-[#f5f2e8]"
                >
                  Upload file
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={insertImageFromUrl}
                  className="cursor-pointer px-3 py-2 text-left text-[13px] font-bold whitespace-nowrap text-[#111] hover:bg-[#f5f2e8]"
                >
                  Attach URL
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files?.[0])}
            />
          </div>
        </div>
        <EditorContent editor={editor} />
      </div>
      {uploadError && <p className="mt-1.5 text-[13px] font-bold text-[#dc2626]">{uploadError}</p>}
    </div>
  );
}
```

- [ ] **Step 3: Update `WorkHistoryForm.tsx` to pass the new required prop**

In `components/majourney/WorkHistoryForm.tsx`, change:

```tsx
      <Field label="Description">
        <RichTextEditor value={form.description} onChange={(html) => setField("description", html)} />
      </Field>
```

to:

```tsx
      <Field label="Description">
        <RichTextEditor value={form.description} onChange={(html) => setField("description", html)} folder="work-history" />
      </Field>
```

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, log into `/majourney/login`, open `http://localhost:3000/majourney/work-history/new`. In the Description editor, click "Image" → "Attach URL", paste any `https://` image URL (e.g. `https://placehold.co/600x300`), confirm the image appears inline in the editor. Click "Image" → "Upload file", pick a local image file, confirm it uploads (button shows "Uploading…" briefly) and the image appears inline.

- [ ] **Step 5: Commit**

```bash
git add components/majourney/RichTextEditor.tsx components/majourney/WorkHistoryForm.tsx app/globals.css
git commit -m "$(cat <<'EOF'
feat: add image upload/URL support to RichTextEditor

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Extend the sanitizer allowlist for `img`

**Files:**
- Modify: `lib/majourney/html.ts:8-9`

- [ ] **Step 1: Add `img`/`src`/`alt` to the allowlist**

Change:

```ts
const ALLOWED_TAGS = ["p", "br", "strong", "em", "s", "ul", "ol", "li", "h3", "blockquote", "a"];
const ALLOWED_ATTR = ["href"];
```

to:

```ts
const ALLOWED_TAGS = ["p", "br", "strong", "em", "s", "ul", "ol", "li", "h3", "blockquote", "a", "img"];
const ALLOWED_ATTR = ["href", "src", "alt"];
```

`ALLOWED_URI_REGEXP` (`/^https?:\/\//i`) already applies to every URI-bearing attribute DOMPurify recognizes, `src` included, so no separate URL check is needed.

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run:
```bash
node -e "
const DOMPurify = require('isomorphic-dompurify');
const html = '<p>Hi</p><img src=\"https://example.com/a.png\" alt=\"x\"><img src=\"javascript:alert(1)\">';
console.log('sanitized:', DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p','img'], ALLOWED_ATTR: ['src','alt'], ALLOWED_URI_REGEXP: /^https?:\/\//i }));
"
```
Expected output: `sanitized: <p>Hi</p><img src="https://example.com/a.png" alt="x"><img>` — the `javascript:` src is stripped off the second `<img>` (DOMPurify removes the disallowed attribute, not the element itself, leaving an empty `<img>` with no `src`), while the `https://` one survives untouched. An `<img>` with no `src` renders nothing visible, so this is safe even though the tag remains.

- [ ] **Step 3: Commit**

```bash
git add lib/majourney/html.ts
git commit -m "$(cat <<'EOF'
feat: allow sanitized img tags in rich-text HTML

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Add `backLabel` to AdminFormPage, update work-history's pages

**Files:**
- Modify: `components/majourney/AdminFormPage.tsx`
- Modify: `app/majourney/work-history/new/page.tsx:36`
- Modify: `app/majourney/work-history/[id]/edit/page.tsx:51`

`AdminFormPage`'s back link currently hardcodes "← Back to Work History" — it needs to say "← Back to Blog" for the new blog pages (Tasks 8–9), so it becomes a `backLabel` prop.

- [ ] **Step 1: Add the `backLabel` prop**

In `components/majourney/AdminFormPage.tsx`, change:

```tsx
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
```

to:

```tsx
type AdminFormPageProps = {
  title: string;
  backHref: string;
  backLabel: string;
  onSave: () => void;
  saveLabel?: string;
  saving?: boolean;
  error?: string | null;
  children: ReactNode;
};

export default function AdminFormPage({
  title,
  backHref,
  backLabel,
  onSave,
  saveLabel = "Save",
  saving = false,
  error,
  children,
}: AdminFormPageProps) {
  return (
    <div>
      <Link href={backHref} className="mb-4 inline-block text-[13px] font-bold text-[#111] underline">
        ← Back to {backLabel}
      </Link>
```

- [ ] **Step 2: Pass `backLabel` from both work-history pages**

In `app/majourney/work-history/new/page.tsx`, change:

```tsx
    <AdminFormPage title="Add Work History" backHref="/majourney/work-history" saving={saving} error={error} onSave={save}>
```

to:

```tsx
    <AdminFormPage title="Add Work History" backHref="/majourney/work-history" backLabel="Work History" saving={saving} error={error} onSave={save}>
```

In `app/majourney/work-history/[id]/edit/page.tsx`, change:

```tsx
    <AdminFormPage title="Edit Work History" backHref="/majourney/work-history" saving={saving} error={error} onSave={save}>
```

to:

```tsx
    <AdminFormPage title="Edit Work History" backHref="/majourney/work-history" backLabel="Work History" saving={saving} error={error} onSave={save}>
```

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors (both call sites now pass the required `backLabel`).

Run: `pnpm dev`, open `http://localhost:3000/majourney/work-history/new`. Expected: back link still reads "← Back to Work History".

- [ ] **Step 4: Commit**

```bash
git add components/majourney/AdminFormPage.tsx app/majourney/work-history/new/page.tsx "app/majourney/work-history/[id]/edit/page.tsx"
git commit -m "$(cat <<'EOF'
refactor: make AdminFormPage's back-link label configurable

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Extract shared blog form helpers

**Files:**
- Create: `lib/majourney/blog.ts`

Mirrors `lib/majourney/work-history.ts` — pulls the form-shaping helpers out so the new `BlogPostForm`, `new/page.tsx`, and `[id]/edit/page.tsx` (Tasks 6–8) can all share them instead of duplicating.

- [ ] **Step 1: Create the module**

Create `lib/majourney/blog.ts`:

```ts
import type { BlogPost } from "@/lib/api-types";
import type { BlogPostInput } from "./inputs";

export const EMPTY_FORM: BlogPostInput = {
  title: "",
  content: "",
  category: null,
  tagNames: [],
  thumbnailUrl: null,
  status: "draft",
};

export function toForm(item: BlogPost): BlogPostInput {
  return {
    title: item.title,
    content: item.content,
    category: item.category,
    tagNames: item.tags.map((t) => t.name),
    thumbnailUrl: item.thumbnailUrl,
    status: item.status,
  };
}

/** Splits a comma-separated tags text input into a clean list of tag names. */
export function splitList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/majourney/blog.ts
git commit -m "$(cat <<'EOF'
feat: add shared blog post form helpers

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Build the BlogPostForm component

**Files:**
- Create: `components/majourney/BlogPostForm.tsx`

The Status field only shows in edit mode, matching the current modal's behavior (a new post is always created as `draft`).

- [ ] **Step 1: Create the component**

Create `components/majourney/BlogPostForm.tsx`:

```tsx
"use client";

import { Field, Select, TextInput } from "@/components/majourney/FormField";
import ImageUploadField from "@/components/majourney/ImageUploadField";
import RichTextEditor from "@/components/majourney/RichTextEditor";
import type { BlogPostInput } from "@/lib/majourney/inputs";

type BlogPostFormProps = {
  mode: "add" | "edit";
  form: BlogPostInput;
  setField: <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) => void;
  tagsText: string;
  onTagsTextChange: (value: string) => void;
};

export default function BlogPostForm({ mode, form, setField, tagsText, onTagsTextChange }: BlogPostFormProps) {
  return (
    <>
      <Field label="Title">
        <TextInput value={form.title} onChange={(e) => setField("title", e.target.value)} />
      </Field>
      {mode === "edit" && (
        <Field label="Status">
          <Select value={form.status} onChange={(e) => setField("status", e.target.value as BlogPostInput["status"])}>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </Select>
        </Field>
      )}
      <Field label="Category">
        <TextInput value={form.category ?? ""} onChange={(e) => setField("category", e.target.value || null)} />
      </Field>
      <Field label="Tags (comma-separated)">
        <TextInput value={tagsText} onChange={(e) => onTagsTextChange(e.target.value)} />
      </Field>
      <div className="mb-3.5">
        <ImageUploadField
          label="Thumbnail"
          value={form.thumbnailUrl}
          onChange={(url) => setField("thumbnailUrl", url)}
          folder="blog"
        />
      </div>
      <Field label="Content">
        <RichTextEditor value={form.content} onChange={(html) => setField("content", html)} folder="blog" />
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
git add components/majourney/BlogPostForm.tsx
git commit -m "$(cat <<'EOF'
feat: add shared BlogPostForm field set

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Add the blog "new" (Add) page

**Files:**
- Create: `app/majourney/blog/new/page.tsx`

- [ ] **Step 1: Create the page**

Create `app/majourney/blog/new/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminFormPage from "@/components/majourney/AdminFormPage";
import BlogPostForm from "@/components/majourney/BlogPostForm";
import { ApiError } from "@/lib/majourney/api-client";
import { EMPTY_FORM, splitList } from "@/lib/majourney/blog";
import type { BlogPostInput } from "@/lib/majourney/inputs";

export default function NewBlogPostPage() {
  const { createBlogPost } = useAdminData();
  const router = useRouter();
  const [form, setForm] = useState<BlogPostInput>(EMPTY_FORM);
  const [tagsText, setTagsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await createBlogPost({ ...form, tagNames: splitList(tagsText) });
      router.push("/majourney/blog");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save blog post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormPage title="Add Blog Post" backHref="/majourney/blog" backLabel="Blog" saving={saving} error={error} onSave={save}>
      <BlogPostForm mode="add" form={form} setField={setField} tagsText={tagsText} onTagsTextChange={setTagsText} />
    </AdminFormPage>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, open `http://localhost:3000/majourney/blog/new`. Expected: page renders with the back link ("← Back to Blog"), empty Title/Category/Tags fields, thumbnail uploader, and the rich text editor with its Image button — no Status field (add mode).

- [ ] **Step 3: Commit**

```bash
git add app/majourney/blog/new/page.tsx
git commit -m "$(cat <<'EOF'
feat: add dedicated 'add blog post' page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Add the blog "edit" page

**Files:**
- Create: `app/majourney/blog/[id]/edit/page.tsx`

- [ ] **Step 1: Create the page**

Create `app/majourney/blog/[id]/edit/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminFormPage from "@/components/majourney/AdminFormPage";
import BlogPostForm from "@/components/majourney/BlogPostForm";
import { ApiError } from "@/lib/majourney/api-client";
import { toForm, splitList } from "@/lib/majourney/blog";
import type { BlogPostInput } from "@/lib/majourney/inputs";

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const { blogPosts, updateBlogPost } = useAdminData();
  const router = useRouter();
  const item = blogPosts.find((b) => b.id === id);

  const [form, setForm] = useState<BlogPostInput | null>(item ? toForm(item) : null);
  const [tagsText, setTagsText] = useState(item ? item.tags.map((t) => t.name).join(", ") : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!item || !form) {
    return (
      <div>
        <p className="mb-3 text-sm font-semibold text-[#111]">Blog post not found.</p>
        <Link href="/majourney/blog" className="text-[13px] font-bold text-[#111] underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const setField = <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await updateBlogPost(id, { ...form, tagNames: splitList(tagsText) });
      router.push("/majourney/blog");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save blog post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormPage title="Edit Blog Post" backHref="/majourney/blog" backLabel="Blog" saving={saving} error={error} onSave={save}>
      <BlogPostForm mode="edit" form={form} setField={setField} tagsText={tagsText} onTagsTextChange={setTagsText} />
    </AdminFormPage>
  );
}
```

Same note as work-history's edit page: `AdminGate` already blocks rendering until `AdminDataContext` finishes loading, so `blogPosts` is already populated by the time this mounts — the only local edge case is "no post with this id".

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, open `http://localhost:3000/majourney/blog`, note an existing post's id (network tab, or add one via the still-present old modal first if none exist yet), then open `http://localhost:3000/majourney/blog/<that-id>/edit`. Expected: form pre-filled, including content rendered as rich text (with any existing images, once one has been saved via Task 2's editor). Also visit `.../blog/nonexistent-id/edit`. Expected: "Blog post not found." with a back link.

- [ ] **Step 3: Commit**

```bash
git add "app/majourney/blog/[id]/edit/page.tsx"
git commit -m "$(cat <<'EOF'
feat: add dedicated 'edit blog post' page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Simplify the admin blog list page

**Files:**
- Modify: `app/majourney/blog/page.tsx` (full rewrite — removes the modal entirely)

- [ ] **Step 1: Rewrite the page as list-only**

Replace the full contents of `app/majourney/blog/page.tsx` with:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import { ApiError } from "@/lib/majourney/api-client";

export default function AdminBlogPage() {
  const { blogPosts, deleteBlogPost, errors } = useAdminData();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    setActionError("");
    setDeletingId(id);
    try {
      await deleteBlogPost(id);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete blog post.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {errors.blog && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {errors.blog}
        </p>
      )}
      {actionError && (
        <p className="mb-4 border-[3px] border-[#111] bg-white p-3 text-[13px] font-bold text-[#dc2626]">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex justify-end">
        <Link
          href="/majourney/blog/new"
          className="cursor-pointer border-[3px] border-[#111] bg-[#c8ff00] px-4 py-2.5 text-[13px] font-bold text-[#111] shadow-[4px_4px_0_#111]"
        >
          + Add blog post
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {blogPosts.map((b) => {
          const published = b.status === "published";
          return (
            <div
              key={b.id}
              className="box-border flex h-full flex-col overflow-hidden border-[3px] border-[#111] bg-white shadow-[6px_6px_0_#111]"
            >
              <div className="flex h-20 shrink-0 items-center justify-center overflow-hidden bg-[#111] px-3 text-center text-xs font-bold text-white">
                {b.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded URL
                  <img src={b.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  "No thumbnail set"
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <h3 className="m-0 text-[15px] font-extrabold text-[#111]">{b.title}</h3>
                  <span
                    className={`inline-block border-2 border-[#111] px-2.5 py-0.5 text-xs font-bold ${
                      published ? "bg-[#111] text-white" : "bg-white text-[#111]"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="m-0 mb-3 line-clamp-3 text-sm text-[#111]">{b.excerpt}</p>
                <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
                  {b.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="border-2 border-[#111] bg-white px-[9px] py-1 text-[11px] font-bold text-[#111]"
                    >
                      {tag.name}
                    </span>
                  ))}
                  <span className="text-[11px] text-[#555]">
                    {b.wordCount} words · {b.timeToReadMinutes} min
                  </span>
                </div>
                <div className="mt-auto flex gap-2">
                  <Link
                    href={`/majourney/blog/${b.id}/edit`}
                    className="flex-1 cursor-pointer border-[3px] border-[#111] bg-white py-2 text-center text-[13px] font-bold text-[#111]"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    disabled={deletingId === b.id}
                    className="flex-1 cursor-pointer border-[3px] border-[#111] bg-[#ff3b30] py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === b.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

This removes `AdminModal`, `Field`/`Select`/`TextArea`/`TextInput`, `ImageUploadField`, `EMPTY_FORM`/`toForm`/`splitList`/`BlogPostInput`/`BlogPost` imports from this file (they're no longer used here — `BlogPostForm` and the new pages use them now), and all the modal/form state (`openAdd`/`openEdit`/`close`/`setField`/`save`/`modal`/`saving`/`modalError`) — none of it is needed once Add/Edit navigate to their own pages.

- [ ] **Step 2: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors (no unused-import issues — every import in the new file is used).

Run: `pnpm dev`, open `http://localhost:3000/majourney/blog`. Expected: "+ Add blog post" and each card's "Edit" now navigate to the new pages (no modal appears); Delete still works with its confirm dialog.

- [ ] **Step 3: Commit**

```bash
git add app/majourney/blog/page.tsx
git commit -m "$(cat <<'EOF'
refactor: replace blog add/edit modal with dedicated pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Public API helpers for the real blog data

**Files:**
- Modify: `lib/portfolio-api.ts`
- Create: `lib/blog-display.ts`

- [ ] **Step 1: Add `getBlogPosts`/`getBlogPostBySlug`**

In `lib/portfolio-api.ts`, change the top import block from:

```ts
import "server-only";
import type {
  ApiResult,
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
import "server-only";
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

Then, at the end of the file (after `getHomeData`), add:

```ts

export async function getBlogPosts(): Promise<ApiResult<ListResponse<BlogPost>>> {
  // Same limit the admin panel already uses for its own blog list
  // (`AdminDataContext`'s `/admin/blog?limit=100&offset=0`) and the
  // backend's max allowed `limit` — no pagination UI exists yet, so this
  // fetches every published post in one call.
  return fetchJson<ListResponse<BlogPost>>("/blog?limit=100&offset=0");
}

export async function getBlogPostBySlug(slug: string): Promise<ApiResult<BlogPost>> {
  return fetchJson<BlogPost>(`/blog/${encodeURIComponent(slug)}`);
}
```

- [ ] **Step 2: Create the decorative fallback-palette helper**

Real blog posts don't carry the mock data's hand-picked per-post `bg`/`fg` colors. Create `lib/blog-display.ts` for a small deterministic substitute, used by the public list/detail pages (Tasks 11–12) when a post has no thumbnail:

```ts
const PALETTE: { bg: string; fg: string }[] = [
  { bg: "#1410ff", fg: "#c8ff00" },
  { bg: "#c8ff00", fg: "#111" },
];

/**
 * Deterministic decorative color pair for a blog post's fallback thumbnail
 * block (used when the post has no thumbnailUrl), keyed by the post's id so
 * the same post always gets the same colors across renders.
 */
export function pickBlogPalette(id: string): { bg: string; fg: string } {
  const sum = Array.from(id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}
```

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/portfolio-api.ts lib/blog-display.ts
git commit -m "$(cat <<'EOF'
feat: add public blog list/detail API helpers

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Wire the public blog list page to the real API

**Files:**
- Create: `app/blog/BlogListClient.tsx`
- Modify: `app/blog/page.tsx` (full rewrite — becomes a server component)
- Delete: `app/blog/posts.ts`

`app/blog/page.tsx` today is a `"use client"` component holding both the fetch-free mock data and the tag-filter interaction. It splits into a server component (fetches once, no interactivity) and a client component (owns the `activeTag` state), mirroring how `app/page.tsx` fetches server-side and hands data down to section components.

- [ ] **Step 1: Create the client component**

Create `app/blog/BlogListClient.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useWindowWidth } from "@/components/useWindowWidth";
import { StatusStrip } from "@/components/StatusStrip";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SectionState } from "@/components/home/SectionState";
import { mono, anton, archivo } from "@/components/fonts";
import { formatPostDate, initials } from "@/components/home/formatters";
import { pickBlogPalette } from "@/lib/blog-display";
import type { BlogPost } from "@/lib/portfolio-api";

const activeTagStyle = { ...mono, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, color: "#fff", background: "#1410ff", border: "2px solid #111", padding: "8px 16px", cursor: "pointer" };
const inactiveTagStyle = { ...mono, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, color: "#111", background: "#ebe7d9", border: "2px solid #111", padding: "8px 16px", cursor: "pointer" };

type BlogListClientProps = {
  posts: BlogPost[];
  error: string | null;
};

export function BlogListClient({ posts, error }: BlogListClientProps) {
  const [activeTag, setActiveTag] = useState("all");
  const width = useWindowWidth();

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  const gridCols = isDesktop ? "repeat(3,1fr)" : isTablet ? "repeat(2,1fr)" : "repeat(1,1fr)";
  const allTags = ["all", ...Array.from(new Set(posts.flatMap((p) => p.tags.map((t) => t.name))))];
  const filtered = activeTag === "all" ? posts : posts.filter((p) => p.tags.some((t) => t.name === activeTag));

  return (
    <div style={{ background: "#ebe7d9", minHeight: "100vh" }}>
      <StatusStrip />

      <Nav variant="subpage" isMobile={isMobile} />

      {/* PAGE HEADER */}
      <section style={{ padding: "clamp(28px,5vw,56px) clamp(24px,5vw,64px)", borderBottom: "4px solid #111" }}>
        <a href="/" style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#111", textDecoration: "none", display: "inline-block", marginBottom: 20 }}>
          ← Back Home
        </a>
        <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#1410ff", marginBottom: 12 }}>[ WRITING ]</div>
        <h1 style={{ ...anton, fontSize: "clamp(44px,8vw,120px)", lineHeight: "0.85", textTransform: "uppercase", color: "#111", margin: "0 0 20px", letterSpacing: -1 }}>The Blog</h1>
        <p style={{ ...archivo, fontSize: "clamp(14px,1.6vw,18px)", fontWeight: 500, lineHeight: 1.6, color: "#111", maxWidth: 560, margin: "0 0 28px" }}>
          Notes on React Native, backend systems, and lessons from shipping mobile products at scale.
        </p>
        {allTags.length > 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {allTags.map((tag) => (
              <button key={tag} onClick={() => setActiveTag(tag)} style={tag === activeTag ? activeTagStyle : inactiveTagStyle}>
                {tag === "all" ? "All" : tag}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* POSTS GRID */}
      <section style={{ padding: "clamp(24px,5vw,64px)" }}>
        {error ? (
          <SectionState title="Blog unavailable" message={error} />
        ) : filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: "clamp(14px,2vw,22px)" }}>
            {filtered.map((post) => {
              const palette = pickBlogPalette(post.id);
              return (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  style={{ background: "#fff", border: "3px solid #111", boxShadow: "6px 6px 0 #0a0a0a", display: "flex", flexDirection: "column", textDecoration: "none" }}
                >
                  <div
                    style={{
                      height: "clamp(90px,10vw,130px)",
                      background: post.thumbnailUrl ? undefined : palette.bg,
                      borderBottom: "3px solid #111",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      ...(!post.thumbnailUrl && {
                        ...anton,
                        fontSize: "clamp(32px,5vw,52px)",
                        color: palette.fg,
                        letterSpacing: -2,
                        WebkitTextStroke: "1.5px #111",
                      }),
                    }}
                  >
                    {post.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- rendering an arbitrary uploaded/attached URL
                      <img src={post.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      initials(post.title)
                    )}
                  </div>
                  <div style={{ padding: "clamp(16px,2vw,22px)", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                      {post.tags.map((t) => (
                        <span key={t.id} style={{ ...mono, fontSize: "clamp(9px,1vw,11px)", fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#c8ff00", border: "2px solid #111", padding: "3px 7px" }}>
                          {t.name}
                        </span>
                      ))}
                    </div>
                    <h2 style={{ ...archivo, fontSize: "clamp(16px,1.8vw,20px)", fontWeight: 800, color: "#111", margin: "0 0 10px", lineHeight: 1.25 }}>{post.title}</h2>
                    <p style={{ ...archivo, fontSize: "clamp(12px,1.2vw,14px)", fontWeight: 500, lineHeight: 1.6, color: "#111", margin: 0, flex: 1 }}>{post.excerpt}</p>
                    <div style={{ ...mono, fontSize: "clamp(10px,1.1vw,12px)", fontWeight: 700, textTransform: "uppercase", color: "#111", borderTop: "2px solid #111", marginTop: 16, paddingTop: 10 }}>
                      {formatPostDate(post.publishedAt)} · {post.timeToReadMinutes} min
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 24px", border: "3px solid #111", background: "#fff" }}>
            <h3 style={{ ...anton, fontSize: 32, textTransform: "uppercase", color: "#111", margin: "0 0 12px" }}>No posts found</h3>
            <p style={{ ...archivo, fontSize: 15, color: "#111", margin: "0 0 24px" }}>
              {posts.length === 0 ? "No posts have been published yet." : "Try a different tag."}
            </p>
            {posts.length > 0 && (
              <button
                onClick={() => setActiveTag("all")}
                style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#fff", background: "#1410ff", border: "3px solid #111", padding: "12px 24px", cursor: "pointer" }}
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </section>

      <Footer subpage />
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `app/blog/page.tsx` as a server component**

Replace the full contents of `app/blog/page.tsx` with:

```tsx
import { getBlogPosts } from "@/lib/portfolio-api";
import { BlogListClient } from "./BlogListClient";

export default async function Blog() {
  const { data, error } = await getBlogPosts();
  return <BlogListClient posts={data?.items ?? []} error={error} />;
}
```

- [ ] **Step 3: Delete the mock data file**

```bash
rm app/blog/posts.ts
```

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors (in particular, no dangling import of the deleted `./posts` module).

Run: `pnpm dev`, open `http://localhost:3000/blog`. Expected (with the `areydra-be` backend running and at least one `published` blog post seeded, ideally one with a thumbnail and one without): the list renders real posts with correct titles/tags/dates, tag filter buttons work, cards with a thumbnail show the real image, cards without one show a colored initials block, and each card links to `/blog/<slug>`. If the backend is unreachable, confirm the "Blog unavailable" state renders instead of a crash.

- [ ] **Step 5: Commit**

```bash
git add app/blog/page.tsx app/blog/BlogListClient.tsx
git rm app/blog/posts.ts
git commit -m "$(cat <<'EOF'
feat: wire public blog list page to the real API

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Wire the public blog detail page to the real API

**Files:**
- Create: `app/blog/[slug]/page.tsx`
- Delete: `app/blog/[id]/page.tsx` (and the now-empty `app/blog/[id]/` directory)

Renamed from `[id]` to `[slug]` since the backend looks posts up by slug, not array index — today's `/blog/0`-style links are mock-only, so nothing real breaks.

- [ ] **Step 1: Create the new detail page**

Create `app/blog/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { StatusStrip } from "@/components/StatusStrip";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { mono, anton, archivo } from "@/components/fonts";
import { formatPostDate } from "@/components/home/formatters";
import { sanitizeHtml } from "@/lib/majourney/html";
import { getBlogPostBySlug } from "@/lib/portfolio-api";

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div style={{ background: "#ebe7d9", minHeight: "100vh" }}>
      <StatusStrip />

      <Nav variant="detail" />

      {/* ARTICLE HEADER */}
      <section style={{ padding: "clamp(28px,5vw,56px) clamp(24px,5vw,64px)", borderBottom: "4px solid #111", background: "#1410ff" }}>
        <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#c8ff00", marginBottom: 16 }}>
          {post.category ?? "ARTICLE"}
        </div>
        <h1 style={{ ...anton, fontSize: "clamp(30px,6vw,80px)", lineHeight: "0.95", textTransform: "uppercase", color: "#c8ff00", margin: "0 0 22px", letterSpacing: -1 }}>
          {post.title}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {post.tags.map((t) => (
            <span key={t.id} style={{ ...mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#ebe7d9", border: "2px solid #111", padding: "4px 10px" }}>
              {t.name}
            </span>
          ))}
        </div>
        <div style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#c8ff00" }}>
          {formatPostDate(post.publishedAt)} · {post.timeToReadMinutes} min · By Areydra
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section style={{ padding: "clamp(28px,5vw,64px)", maxWidth: 820, margin: "0 auto" }}>
        {post.thumbnailUrl && (
          <div style={{ border: "3px solid #111", boxShadow: "7px 7px 0 #0a0a0a", marginBottom: 32, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- rendering an arbitrary uploaded/attached URL */}
            <img src={post.thumbnailUrl} alt="" style={{ width: "100%", display: "block" }} />
          </div>
        )}
        <div
          className="rich-text-content"
          style={{ ...archivo, fontSize: "clamp(14px,1.5vw,17px)", fontWeight: 500, lineHeight: 1.8, color: "#111" }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />

        <div style={{ border: "3px solid #111", background: "#c8ff00", boxShadow: "8px 8px 0 #111", padding: "clamp(20px,3vw,32px)", marginTop: 40 }}>
          <div style={{ ...anton, fontSize: 24, textTransform: "uppercase", color: "#111", marginBottom: 10 }}>Enjoyed this?</div>
          <p style={{ ...archivo, fontSize: 14, fontWeight: 600, color: "#111", margin: "0 0 18px" }}>
            Read more on the blog, or reach out — always happy to talk shop.
          </p>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap", border: "3px solid #111", width: "fit-content" }}>
            <a href="/blog" style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#fff", background: "#1410ff", padding: "12px 22px", textDecoration: "none" }}>
              More Posts
            </a>
            <a
              href="mailto:areydra@gmail.com"
              style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#ebe7d9", padding: "12px 22px", textDecoration: "none", borderLeft: "3px solid #111" }}
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer subpage />
    </div>
  );
}
```

Note: this drops `generateStaticParams` — the old one enumerated the mock array's indices, which has no equivalent for real, changing posts. The page fetches per-request through `getBlogPostBySlug`, cached via `fetchJson`'s existing `next: { revalidate: 300 }`, the same caching model `getHomeData()` already relies on — no build-time static param list is needed.

- [ ] **Step 2: Delete the old mock-based detail page**

```bash
rm -rf "app/blog/[id]"
```

- [ ] **Step 3: Verify**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm dev`, open `http://localhost:3000/blog/<slug-of-a-published-post>` (get a real slug from the admin blog list or the `/blog` page you just wired up in Task 11). Expected: header renders title/tags/date/read time from real data, the body renders the post's sanitized rich-text content — including any image embedded via the Task 2 editor, displayed inline and capped at the article width. Then open `http://localhost:3000/blog/not-a-real-slug`. Expected: Next.js's not-found page (404).

- [ ] **Step 4: Commit**

```bash
git add "app/blog/[slug]/page.tsx"
git rm -r "app/blog/[id]"
git commit -m "$(cat <<'EOF'
feat: wire public blog detail page to the real API

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Manual end-to-end QA pass

No files change in this task — it's verification only, covering the spec's acceptance criteria as a whole. Requires the `areydra-be` backend running locally and reachable at `NEXT_PUBLIC_API_BASE_URL`.

- [ ] **Step 1: Full blog admin add/edit/delete flow, with images**

Run: `pnpm dev`, log into `/majourney/login`, go to Blog.
1. Click "+ Add blog post" → fill in Title/Category/Tags, upload a Thumbnail, and in the Content editor: add a bold phrase, a bullet list, an uploaded image (via "Image" → "Upload file"), and a URL-attached image (via "Image" → "Attach URL") → Save.
   Expected: redirected to the list; the new card appears with the thumbnail and a plain-text excerpt (server-derived).
2. Click "Edit" on that card. Expected: the rich text editor shows the bold text, bullet list, and both images exactly as entered. Change the Status to `published`, Save.
   Expected: redirected to the list, card now shows a "published" badge.
3. Click "Delete" on a *different, disposable* test post, confirm.
   Expected: entry removed from the list. (Keep the published one with images for the next steps.)

- [ ] **Step 2: Public pages show the real, published post with images**

1. Open `http://localhost:3000/blog`. Expected: the published post from Step 1 appears in the grid with its real thumbnail, title, and tags.
2. Click into it (or open `http://localhost:3000/blog/<its-slug>` directly). Expected: both images from the editor render in the article body, sized to fit the column (`max-width: 100%`), and any list/bold formatting is preserved.
3. Filter by one of the post's tags on `/blog`. Expected: the post remains visible; switch to a tag it doesn't have (if any other posts exist) and confirm it's filtered out; "All" brings it back.

- [ ] **Step 3: XSS defense check (img vector)**

1. Temporarily edit the post's content through the admin API directly (e.g. via `curl` or replaying the update request from devtools' Network tab) to include `<img src="javascript:alert(1)">` and `<script>alert(2)</script>` alongside normal content.
2. Reload `/blog/<its-slug>`. Expected: no alert fires; viewing page source shows the `<script>` tag is entirely absent and the malicious `<img>` has no `src` attribute (or is absent, depending on DOMPurify's exact stripping) — confirming render-time sanitization protects against HTML written directly to the API.
3. Restore the post's content to the Step 1 version afterward via the admin edit page.

- [ ] **Step 4: Not-found routes**

1. Visit `/majourney/blog/does-not-exist/edit` directly. Expected: "Blog post not found." with a working "← Back to Blog" link.
2. Visit `/blog/does-not-exist-slug` directly. Expected: Next.js 404 page.

- [ ] **Step 5: Full typecheck and lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: both exit 0.

No commit for this task (verification only). If any step surfaces a bug, fix it as a small follow-up commit referencing the task/step it corresponds to.
