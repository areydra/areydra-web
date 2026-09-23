# Blog: Rich Text + Image Support (Admin + Public)

Date: 2026-09-23
Status: Approved (ready for implementation plan)

## Problem

`app/majourney/blog/page.tsx` still uses the "old" pattern work-history had
before its `c80fceb`/`0590820`/`248e006`/`4106272`/`fb4b14b` refactor: add/edit
happens in an `AdminModal` with `content` as a plain `<textarea>`. Separately,
the public-facing blog pages (`app/blog/page.tsx`, `app/blog/[id]/page.tsx`)
render hand-authored mock data (`app/blog/posts.ts`), never the real API, so
there is currently no live place a blog post's content is actually shown to
visitors.

This change: (1) brings blog's admin editing up to the same dedicated-page +
rich text pattern as work-history, (2) adds image support to the shared rich
text editor (upload file or attach by URL) so blog posts can embed images in
their body, and (3) wires the public blog pages to the real API so real posts
(with real embedded images) are actually visible.

## Current state (relevant facts)

- `components/majourney/RichTextEditor.tsx` (Tiptap: `@tiptap/react` +
  `@tiptap/starter-kit`) already exists from the work-history feature, with a
  toolbar (bold/italic/strike/H3/lists/blockquote/link) and
  `isomorphic-dompurify`-based sanitization (`lib/majourney/html.ts`). It has
  **no image support today** — no `@tiptap/extension-image` installed, and the
  sanitizer's allowlist doesn't include `img`.
- Image upload already exists and works: `lib/majourney/uploads.ts`'s
  `uploadImage(file, folder, token)` calls the backend's
  `POST /admin/uploads/presign`, then `PUT`s the file directly to Cloudflare
  R2, returning a public URL. `folder` must be one of the backend's
  `UPLOAD_FOLDERS` (`profile`, `work-history`, `projects`, `blog`) — `"blog"`
  already exists and is used today for the thumbnail field
  (`components/majourney/ImageUploadField.tsx` at
  `app/majourney/blog/page.tsx`). The new in-editor image button reuses this
  same function with `folder: "blog"`, so uploads from a blog post body land
  in the same R2 folder as the blog thumbnail, the same way work-history's
  logo upload uses `folder: "work-history"`.
- `blogPosts.content` (Drizzle schema, `areydra-be`) is a plain
  `text().notNull()` column, validated by Zod as a plain `z.string()`
  (`BlogPostBody` in `src/schemas/blog.ts`) — no backend/schema change is
  needed to store richer HTML (including `<img>` tags) in `content`.
- `app/majourney/blog/page.tsx` currently combines listing + add/edit modal:
  `EMPTY_FORM`/`toForm`/`splitList` helpers, a card grid, and an `AdminModal`
  with fields Title, Status, Category, Tags, Thumbnail (`ImageUploadField`,
  folder `"blog"`), and Content as a plain `<TextArea>`. `createBlogPost` /
  `updateBlogPost` / `deleteBlogPost` come from `useAdminData()` and already
  call the backend's real CRUD endpoints — only the UI/editor needs to change.
- The backend already exposes everything needed for public wiring, so **no
  backend changes are required anywhere in this feature**:
  - `GET /blog` (public, paginated, optional `tag`/`category` filter, only
    `status: "published"` rows via `publicBlogFilter`) —
    `src/routes/public/blog.ts`.
  - `GET /blog/:slug` (public, single published post by slug, 404 otherwise).
  - `BlogPost` type (`lib/api-types.ts`) already includes `slug`,
    `thumbnailUrl`, `tags`, `publishedAt`, `timeToReadMinutes`, etc.
- `app/blog/page.tsx` and `app/blog/[id]/page.tsx` are currently fully mock:
  a hardcoded `posts` array (`app/blog/posts.ts`) with fields real posts don't
  have — per-post `bg`/`fg` colors, a big display `num`, and a structured
  `body: string[]` interleaved with one placeholder "image" block. `[id]` is
  literally the array index, not a slug.
- `lib/portfolio-api.ts` (`"server-only"`, used by `app/page.tsx` via
  `getHomeData()`) is the existing pattern for server-side reads of the public
  API with `next: { revalidate: 300 }` — no client-side public data fetching
  exists yet for a full page (only the admin's authenticated `adminRequest`).
- `sanitizeHtml`/`stripHtmlToText` (`lib/majourney/html.ts`) are already used
  to render work-history's `description` on the homepage
  (`components/home/WorkHistorySection.tsx`) via
  `dangerouslySetInnerHTML={{ __html: sanitizeHtml(...) }}` on a
  `.rich-text-content`-classed element. Blog content will follow the same
  convention.

## Design

### 1. Rich text editor: image support

- Add `@tiptap/extension-image` as a new dependency.
- `RichTextEditor.tsx`: add the `Image` extension to `useEditor`'s extension
  list.
- New toolbar control next to the existing Link button: an "Image" button that
  opens a small inline popover (consistent with the toolbar's existing
  bold-border look) with two actions:
  - **Upload**: hidden `<input type="file" accept="image/*">`, on change calls
    `uploadImage(file, "blog", token)` (same presign→PUT flow as the
    thumbnail field), then
    `editor.chain().focus().setImage({ src: publicUrl }).run()`.
  - **Attach URL**: `window.prompt` (matching the existing Link button's
    pattern), inserted the same way if a non-empty `https?://` URL is given.
- `RichTextEditor` is shared by both work-history and blog, so this button is
  generic — it takes a new required `folder: string` prop (the same
  `UPLOAD_FOLDERS` value `ImageUploadField` takes) rather than being hardcoded
  to `"blog"`. `WorkHistoryForm.tsx` is updated to pass `folder="work-history"`
  and `BlogPostForm.tsx` passes `folder="blog"`.
- Requires an auth token for the upload path: `RichTextEditor` reads it via
  `useAdminAuth()` (`contexts/majourney/AdminAuthContext`), the same hook
  `ImageUploadField.tsx` already uses — no new token plumbing needed.

### 2. Sanitization allowlist

- `lib/majourney/html.ts`: add `"img"` to `ALLOWED_TAGS`, and `"src"`, `"alt"`
  to `ALLOWED_ATTR`. `ALLOWED_URI_REGEXP` (`/^https?:\/\//i`) already applies
  to all URI-bearing attributes DOMPurify recognizes (including `src`), so no
  separate URL check is needed for images.
- Global CSS for `.rich-text-content`: add `img { max-width: 100%; height:
  auto; }` so embedded images never overflow the editor or the rendered
  article column.

### 3. Admin: dedicated add/edit pages (mirrors work-history)

```
app/majourney/blog/
  page.tsx            → list only (cards + Add/Edit/Delete)
  new/page.tsx          → "Add" form page
  [id]/edit/page.tsx    → "Edit" form page
```

- **`components/majourney/BlogPostForm.tsx`** (new) — the field set (title,
  status, category, tags, thumbnail, content), extracted from the current
  modal body, with `content` now rendered via `RichTextEditor` (folder
  `"blog"`) instead of `TextArea`. Controlled via `form`/`setField` props,
  same convention as `WorkHistoryForm.tsx`.
- **`app/majourney/blog/new/page.tsx`** — `AdminFormPage` chrome, `EMPTY_FORM`,
  calls `createBlogPost`, navigates back to `/majourney/blog` on success.
- **`app/majourney/blog/[id]/edit/page.tsx`** — reads `id` via `useParams()`,
  looks up the post from the already-loaded `useAdminData()` context (no new
  fetch, same as work-history's edit page), pre-fills via `toForm(item)`,
  calls `updateBlogPost`, same loading/not-found states as work-history's edit
  page.
- `app/majourney/blog/page.tsx` shrinks to: card grid (thumbnail, title,
  status badge, `excerpt`, tags, word count/read time) with "Add" and each
  card's "Edit" becoming `<Link>`s instead of opening modal state. Delete stays
  inline (unchanged). `AdminModal` itself is untouched (still used elsewhere,
  e.g. projects/skills).

### 4. Public pages: wire to the real API

- **`lib/portfolio-api.ts`**: add `getBlogPosts(params?: { tag?: string;
  category?: string })` (→ `GET /blog`, same `fetchJson`/`revalidate: 300`
  pattern as the rest of this file) and `getBlogPostBySlug(slug: string)` (→
  `GET /blog/:slug`, 404 → `null`). No pagination UI is added — the list call
  uses a generous `limit` so all published posts load on one page, consistent
  with the current no-pagination behavior and the small expected post count;
  revisit if the blog grows enough to need it.
- **Route rename**: `app/blog/[id]/` → **`app/blog/[slug]/`**, since posts are
  looked up by slug on the backend, not array index. Today's `/blog/0`-style
  links are mock-only, so nothing real breaks.
- **`app/blog/page.tsx`**: becomes an async server component that calls
  `getBlogPosts()` and passes posts to a small new client component (e.g.
  `BlogListClient.tsx`) that owns just the tag-filter `useState` — mirrors how
  `app/page.tsx` fetches server-side and hands data to client section
  components. Cards: use `post.thumbnailUrl` as a real `<img>` when present;
  when absent, fall back to today's colored placeholder block (derived
  deterministically from the post, e.g. category or title initial, since
  there's no longer a hand-authored per-post color) so the layout doesn't
  break for posts without a thumbnail.
- **`app/blog/[slug]/page.tsx`**: `notFound()` if `getBlogPostBySlug` returns
  null. Header (title, tags, date, read time) keeps its current visual style,
  sourced from real fields (`publishedAt`, `timeToReadMinutes`, `tags`,
  `thumbnailUrl` for the header background/accent in place of the mock's
  hand-picked `bg`/`fg`). Body: replaces the paragraph/placeholder-image
  interleaving with a single sanitized render of the real content —
  `<div className="rich-text-content" dangerouslySetInnerHTML={{ __html:
  sanitizeHtml(post.content) }} />` — since content is one HTML blob (with any
  images embedded inline by the author), not a structured block list.
  `sanitizeHtml`/the `.rich-text-content` styling are reused as-is from
  work-history/the editor for a consistent look.
- `app/blog/posts.ts` (the mock data file) is deleted once nothing references
  it.

### 5. Error handling & validation

Unchanged pattern from work-history: admin pages use `try/catch` around
`createBlogPost`/`updateBlogPost` with the error surfaced in `AdminFormPage`'s
banner, `saving` state disables Save meanwhile. Public pages reuse the
existing `ApiResult`/error-message convention from `lib/portfolio-api.ts` and
`components/home/SectionState.tsx`: `getBlogPosts()`/`getBlogPostBySlug()`
return `{ data: null, error }` on failure rather than throwing, and
`app/blog/page.tsx` renders `SectionState` in place of the grid when
`error` is set, instead of a hard crash. `app/blog/[slug]/page.tsx` calls
`notFound()` both when the post doesn't exist and when the fetch errors,
since there's no partial-content fallback for a single-post page.

### 6. Testing

No test framework exists for these pages today; verification is manual: run
the app, exercise add/edit/delete on a blog post including embedding an
uploaded image and a URL-attached image in the content, confirm sanitization
strips a disallowed tag/script, and confirm the public `/blog` list and
`/blog/[slug]` detail page render real published posts with images visible.

## Out of scope

- Pagination UI for the public blog list.
- Any backend/schema changes to `areydra-be` (none are needed).
- Unsaved-changes navigation warnings (consistent with work-history's scope).
- Image resizing/alignment controls in the editor (images insert at natural
  size, capped by `max-width: 100%` CSS).
