# Projects: Rich Text + Image Support (Admin + Public)

Date: 2026-09-23
Status: Approved (ready for implementation plan)

## Problem

`app/majourney/projects/page.tsx` still uses the "old" pattern (`AdminModal`, `description` as a plain `<TextArea>`) that blog and work-history have already moved off of. Separately, there is currently **no public detail page for projects at all** — only a homepage "Featured Projects" summary section (`components/home/ProjectsSection.tsx`) that shows each project's raw plain-text `description` on a card with no link anywhere.

This change: (1) brings projects' admin editing up to the same dedicated-page + rich text pattern as blog/work-history, and (2) adds a new public `/projects/[slug]` detail page, linked from the homepage's project cards, rendering the project's sanitized rich-text description (with any embedded images) alongside its existing gallery images, tech stack, and links.

## Current state (relevant facts)

- `components/majourney/RichTextEditor.tsx` (Tiptap, with image upload/URL support and a required `folder` prop) and `lib/majourney/html.ts` (`sanitizeHtml`/`stripHtmlToText`, already allowing `img`/`src`/`alt`) both already exist and need **no changes** for this feature — they were built generically during the blog work and the sanitizer allowlist is shared across every consumer.
- `lib/majourney/uploads.ts`'s `uploadImage(file, folder, token)` already accepts `"projects"` as a valid folder (`UPLOAD_FOLDERS` on the backend already includes it — it's used today by the existing thumbnail and gallery (`MultiImageUploadField`) fields on this same form).
- `Project`/`ProjectInput` (`lib/api-types.ts`, `lib/majourney/inputs.ts`) both already type `description` as a plain `string`, identical in shape to blog's `content` and work-history's `description` — no type changes needed.
- `app/majourney/projects/page.tsx` currently combines listing + add/edit modal: `EMPTY_FORM`/`toForm` helpers, a card grid (thumbnail, title, slug, `line-clamp-3` of the **raw** `description`, tech stack), and an `AdminModal` with fields: Title, Role, Project Date, GitHub/Live/App Store/Play Store URLs, Thumbnail (`ImageUploadField`, folder `"projects"`), Gallery Images (`MultiImageUploadField`, folder `"projects"`, a **separate** concept from images embedded in the rich-text body — stays untouched by this change), a Tech Stack checkbox list (from `allSkills`), and Description as a plain `<TextArea>`. `createProject`/`updateProject`/`deleteProject` (from `useAdminData()`) already call the backend's real CRUD endpoints — only the UI/editor needs to change.
- The backend already exposes what's needed for the public page, so **no backend changes are required anywhere in this feature**:
  - `GET /projects` (public, paginated) and `GET /projects/:slug` (public, single project, 404 if missing) — `areydra-be`'s `src/routes/public/projects.ts`. The admin panel's own project list is already sourced from the public `GET /projects` endpoint (`AdminDataContext.tsx`), not an admin-only one.
  - `Project` (`lib/api-types.ts`) already includes `slug`, `role`, `projectDate`, `techStack: ProjectTech[]`, `images: ProjectImage[]`, and the four link fields.
- The homepage's `components/home/ProjectsSection.tsx` already renders real `Project[]` data (sourced from `getHomeData()`'s `/home-config` response, not a new fetch) — each card currently renders raw `project.description` as a plain `<p>` (no HTML rendering, no truncation beyond CSS overflow, no sanitization) and is **not a link to anywhere** (no `<a>`/`href` on the card).
- `AdminFormPage` (`components/majourney/AdminFormPage.tsx`) already has a generic required `backLabel` prop (added during the blog work) — no changes needed, just pass `backLabel="Projects"`.
- No existing `app/projects/` public route exists at all (confirmed: only `app/majourney/projects/page.tsx`, the admin page). This is a net-new public route, not a rename/migration like blog's `[id]`→`[slug]` was.

## Design

### 1. Admin: dedicated add/edit pages (mirrors blog exactly)

```
app/majourney/projects/
  page.tsx            → list only (cards + Add/Edit/Delete)
  new/page.tsx          → "Add" form page
  [id]/edit/page.tsx    → "Edit" form page
```

- **`lib/majourney/projects.ts`** (new) — `EMPTY_FORM: ProjectInput` and `toForm(item: Project): ProjectInput`, extracted verbatim from the current modal's top-level helpers (no `splitList`-equivalent needed — projects have no comma-separated-text field like blog's tags; `skillIds`/`images` are already arrays managed directly by their own UI controls).
- **`components/majourney/ProjectForm.tsx`** (new) — the full field set (title, role, project date, 4 link fields, thumbnail, gallery images, tech-stack checkboxes, description), extracted from the current modal body verbatim except: `description`'s `<TextArea>` is replaced with `<RichTextEditor value={form.description} onChange={(html) => setField("description", html)} folder="projects" />`. Takes `form`, `setField`, and `allSkills`/`toggleSkill` as props (mirroring the modal's existing local `toggleSkill` logic, lifted to the page level the same way `save`/`setField` are). No `mode` prop is needed (unlike blog's Status field) — every field is shown in both add and edit modes, matching current modal behavior.
- **`app/majourney/projects/new/page.tsx`** — `AdminFormPage` chrome (`backLabel="Projects"`), `EMPTY_FORM`, calls `createProject`, navigates back to `/majourney/projects` on success.
- **`app/majourney/projects/[id]/edit/page.tsx`** — reads `id` via `useParams()`, looks up the project from the already-loaded `useAdminData()` context (no new fetch), pre-fills via `toForm(item)`, calls `updateProject`, same loading/not-found states as the blog/work-history edit pages.
- **`app/majourney/projects/page.tsx`** shrinks to: card grid with `stripHtmlToText(p.description)` in place of raw `p.description` for the line-clamped preview (matches work-history's convention — there's no separate `excerpt` field for projects, unlike blog), "Add"/"Edit" become `<Link>`s. Delete stays inline (unchanged). `AdminModal` itself is untouched (still used elsewhere, e.g. skills).

### 2. Public: new project detail page

- **`lib/portfolio-api.ts`**: add `getProjectBySlug(slug: string): Promise<ApiResult<Project>>` (→ `GET /projects/:slug`, same `fetchJson`/`revalidate: 300` pattern as `getBlogPostBySlug`). **No `getProjects()` list function is added** — the homepage's existing `home-config`-sourced project list is the only listing surface in scope; no new `/projects` index route is being built (out of scope, matching what was actually asked for: a detail page, not a list page).
- **`app/projects/[slug]/page.tsx`** (new): `notFound()` if `getProjectBySlug` returns null (covers both "no such slug" and "fetch failed" — same accepted design decision as blog's detail page, since a single-project page has no partial-content fallback). Renders:
  - Header: title, `role` (if present), `projectDate` (formatted inline, e.g. `toLocaleDateString`), tech-stack chips (`techStack: ProjectTech[]`).
  - A link row for whichever of GitHub/Live/App Store/Play Store URLs are present (a small self-contained block in this file — not a reuse of `ProjectsSection`'s internal `ProjectLinks`, since the detail page reasonably shows *all* available links rather than the homepage card's space-constrained `.slice(0, 2)`).
  - An image gallery grid from `images: ProjectImage[]` (sorted by `sortOrder`) — separate section from the body, if any exist.
  - Body: `sanitizeHtml(project.description)` rendered via `dangerouslySetInnerHTML` inside a `.rich-text-content`-classed div — identical convention to the blog detail page and `WorkHistorySection`.
- **`components/home/ProjectsSection.tsx`**: each card's outer `<div>` becomes an `<a href={`/projects/${project.slug}`}>` (cards aren't links today). The description paragraph switches from raw `project.description` to `stripHtmlToText(project.description)`, truncated to 3 lines via an inline-style `-webkit-line-clamp` (matching this file's existing inline-style convention, since it doesn't use Tailwind classes elsewhere) — the full rich content (with any embedded images) is reserved for the new detail page, mirroring how blog's list cards show a short excerpt while the detail page shows full content.

### 3. Explicitly unchanged / out of scope

- No sanitizer changes (`img`/`src`/`alt` already allowed).
- No backend/schema changes (`"projects"` upload folder, public `GET /projects`/`GET /projects/:slug` all already exist).
- Gallery images (`MultiImageUploadField`) and the thumbnail field are untouched — only `description` becomes rich text.
- No new `/projects` public listing route.
- No per-post `generateMetadata` (same accepted gap as blog's detail page).

## Error handling & validation

Identical pattern to blog: admin pages use `try/catch` around `createProject`/`updateProject` with the error surfaced in `AdminFormPage`'s banner, `saving` disables Save meanwhile. The public detail page calls `notFound()` on both a missing slug and a fetch error (see above); no separate error-state UI is needed since there's no partial-content fallback for a single-project page.

## Testing

No test framework exists for these pages; verification is manual: exercise add/edit/delete on a project in the admin panel including embedding an uploaded image and a URL-attached image in the description, confirm the homepage card links to and previews correctly, and confirm the public `/projects/[slug]` page renders the full sanitized content plus gallery/tech-stack/links correctly.
