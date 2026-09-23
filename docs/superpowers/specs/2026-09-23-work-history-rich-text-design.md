# Work History: Rich Text Description + Dedicated Add/Edit Pages

Date: 2026-09-23
Status: Approved (ready for implementation plan)

## Problem

`app/majourney/work-history/page.tsx` currently manages add/edit through a modal
(`AdminModal`), with `description` as a plain `<textarea>`. We want to upgrade
`description` to a rich text editor ([Tiptap](https://tiptap.dev/docs/editor/getting-started/overview)),
and a modal is too cramped for that editing experience — so add/edit moves to
dedicated pages instead.

Scope: **work-history only**. Blog's similar `content` textarea is explicitly
out of scope for this change.

## Current state (relevant facts)

- `AdminDataProvider` wraps all of `/majourney/*` in `app/majourney/layout.tsx`,
  so `workHistory` (the full list) is already loaded and shared across any
  route under `/majourney/work-history/**` — no extra fetch needed for an edit
  page keyed by id.
- `WorkHistoryInput.description` (`lib/majourney/inputs.ts`) is a plain
  `string`; `createWork`/`updateWork` (`AdminDataContext.tsx`) send it to the
  external `areydra-be` API untouched, with no client-side transformation.
- `description` is rendered today in two places, both as plain text (no
  `dangerouslySetInnerHTML` exists anywhere in the repo currently):
  - Public homepage: `components/home/WorkHistorySection.tsx` (`<p>{job.description}</p>`).
  - Admin list card preview: `app/majourney/work-history/page.tsx` (`line-clamp-3`).
- No markdown/HTML rendering or sanitization library exists in the repo yet
  (`package.json` has no `dompurify`/`sanitize-html`/`react-markdown`/etc.).
- No dynamic (`[param]`) route exists yet under `app/majourney/**` — this
  feature introduces that convention there for the first time.
- The backend (`areydra-be`) is a separate repo; its exact validation rules
  (e.g. a possible max length on `description`) aren't visible from here. The
  `status` enum was previously reverse-engineered from a live AJV error — the
  same may need to happen for `description` if a length cap exists.

## Design

### 1. Routing & data flow

```
app/majourney/work-history/
  page.tsx            → list only (cards + Add/Edit/Delete)
  new/page.tsx          → "Add" form page
  [id]/edit/page.tsx    → "Edit" form page
```

- List page: "Add work history" and each card's "Edit" become `<Link>`s to
  `new` / `[id]/edit` instead of opening modal state. Delete is unchanged
  (inline confirm + `deleteWork`, no page needed).
- `new/page.tsx`: renders the shared form with `EMPTY_FORM`, calls
  `createWork` on save, then `router.push("/majourney/work-history")`.
- `[id]/edit/page.tsx`: reads `id` via `useParams()`, looks up the item with
  `workHistory.find(w => w.id === id)` from `useAdminData()` (already-loaded
  context — no new fetch). States:
  - `loading` (from context) → "Loading…"
  - loaded, not found → "Work history entry not found" + link back
  - found → render form pre-filled via `toForm(item)`, calls `updateWork` on
    save, then navigates back to the list.
- No unsaved-changes navigation guard (not requested; keep scope tight).

### 2. Shared components

- **`components/majourney/AdminFormPage.tsx`** (new) — full-page chrome
  replacing `AdminModal` for this flow: back link, `title`, `children`, error
  banner (same red-bordered style as existing `modalError`), sticky Save/Cancel
  button row. Generic enough to be reused if another section moves to a
  dedicated page later. `AdminModal` itself is untouched and stays in use by
  projects/blog/skills.
- **`components/majourney/WorkHistoryForm.tsx`** (new) — the field set
  (company, role, status, start/end month+year, logo upload, description),
  extracted from the current modal body, controlled via `form`/`setField`
  props so both `new` and `edit` pages render identical fields from one place.

### 3. Rich text editor

- **`components/majourney/RichTextEditor.tsx`** (new) — wraps
  `@tiptap/react`'s `useEditor`/`EditorContent`. Controlled like `TextArea`:
  `value: string` (HTML), `onChange: (html: string) => void`.
  - Extensions: `StarterKit` configured to enable only bold, italic, strike,
    bullet list, ordered list, blockquote, and heading restricted to level 3
    (no h1/h2, to avoid clashing with page hierarchy) — plus
    `@tiptap/extension-link` restricted to `http`/`https` protocols.
  - Small toolbar above the editor: B / I / S / • list / 1. list / “ quote /
    H3 / link buttons, styled with the app's existing bold-border look
    (`border-[3px] border-[#111]`, matching `FormField.tsx`'s `inputClass`).
  - Empty-content normalization: Tiptap's `getHTML()` returns `"<p></p>"` for
    an empty editor; the component's `onChange` normalizes that specific value
    to `""` so "empty" behaves the same as the old empty textarea (and avoids
    sending meaningless markup to the API).
- New dependencies: `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`,
  `@tiptap/extension-link`, `isomorphic-dompurify`.

### 4. Sanitization (XSS defense)

`description` is rendered to anonymous public visitors (`WorkHistorySection`),
so stored HTML must be sanitized at render time regardless of who wrote it —
this also protects against the API being hit directly, bypassing the admin
UI's editor constraints.

- **`lib/majourney/html.ts`** (new):
  - `sanitizeHtml(html: string): string` — `isomorphic-dompurify`, allowlist:
    tags `p br strong em s ul ol li h3 blockquote a`; `a` limited to the
    `href` attribute, and only `http`/`https` protocols allowed. All other
    tags/attributes stripped.
  - `stripHtmlToText(html: string): string` — strips all tags, for plain-text
    previews.
- **Public homepage** (`WorkHistorySection.tsx`): render full rich text via
  `dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}`.
- **Admin list card** (`work-history/page.tsx`): keep the `line-clamp-3`
  preview as plain text via `stripHtmlToText(w.description)` — truncating
  nested HTML (e.g. a list cut mid-item) renders badly, and this mirrors the
  existing blog-list convention of showing a plain `excerpt` instead of full
  `content`.

### 5. Error handling & validation

Unchanged pattern from the modal: `try/catch` around `createWork`/`updateWork`,
`ApiError` message surfaced in the page's error banner, `saving` state disables
the Save button meanwhile. No new client-side field validation is added — the
backend remains the source of truth (as with the documented `status` enum
discovery).

**Known risk (not a blocker):** the backend's exact constraints on
`description` (e.g. a possible max length) aren't visible from this repo.
HTML markup adds overhead over the same text, so a long formatted description
could trip a length cap that plain text wouldn't. If this happens, it will
surface as a live API validation error during testing/use, the same way the
`status` enum was discovered — at which point the fix (trim allowed length, or
loosen the backend constraint) will be obvious. No speculative backend change
is made now.

### 6. Testing

No test framework exists for these admin pages today; verification is manual:
run the app, exercise add/edit/delete on work history, and confirm the public
homepage renders sanitized HTML correctly (including a check that a
disallowed tag, e.g. a pasted `<script>`, is stripped). No new test framework
is introduced.

## Out of scope

- Blog post `content` field (stays a plain textarea for now).
- Unsaved-changes navigation warnings.
- Any backend/schema changes to `areydra-be`.
