# Frontend code convention

This repo follows **`conventions/frontend-web-code-convention`** in gbrain (v1.4.1) — load that
page before writing or reviewing app code. This file is only a pointer plus the deviations; never
fork the convention into a local copy.

Gates that must pass before any change is done:

**Package manager: Yarn classic (1.22), pinned in `package.json` → `packageManager`.** `yarn.lock` is
the only lockfile — there is no `pnpm-lock.yaml`, no `package-lock.json`, no npm/pnpm scripts.

```bash
yarn verify            # typecheck → lint → format:check → test → build
yarn verify:security   # secrets → yarn audit (prod deps) → security headers
```

`SECURITY_BASE_URL=http://127.0.0.1:3000` against a running `yarn start` adds the header and
nonce-coverage check. CI (`.github/workflows/verify.yml`) runs `yarn install --frozen-lockfile` and
both gates, the header check against the real production build.

## Project overrides

These deviate from the generic pattern on purpose. Do not "fix" them back without reading why:

- **Homepage chrome lives in `HomeShell`, not `(site)/layout.tsx`.** `/` stays outside the `(site)`
  route group because its chrome differs: `HomeShell` renders `Nav` with the collection toggles and
  `StatusStrip` with the live clock, while the group's layout renders the subpage variants. There is
  no invert/theme toggle — it was removed, so do not reintroduce a filter wrapper around the nav.
- **No Zustand, no TanStack Query.** The admin session is an httpOnly `__Host-session` cookie set by
  `api.areydra.com`. Panel data is fetched on the server in `app/majourney/layout.tsx`
  (`services/admin-data.server.ts`) and handed to the client as initial state; writes run as Server
  Actions (`src/actions/<domain>/*.ts` → `adminApi()`), which forward the caller's cookie
  server-to-server. The only browser→API call left is the `/auth/session` check. This depends on
  `api.areydra.com` staying on the `areydra.com` site — see `docs/backend-session-migration.md`.
  Nothing session-shaped may go back into `localStorage`. There is therefore no `queries/` folder:
  §Data Fetching's query-options rule does not apply here.
- **`services/` is server-only; browser transport is `lib/`.** `services/` holds only
  `*.server.ts` modules (DAL + cookie-forwarding admin client). The browser client
  (`lib/admin-api-client.ts`) and upload helper (`lib/admin-uploads.ts`) live in `lib/`, and client
  layers (`components/`, `hooks/`, `providers/`, `stores/`) may not import `@/services/**` — that is
  an ESLint gate, not a naming habit.
- **The skeleton primitive is `src/components/ui/Skeleton.tsx`**, not `Sk.tsx`:
  `SkeletonRegion` (role="status" + `sr-only` label + `aria-hidden` visual tree), `SkeletonBlock`,
  `SkeletonText`. That is the only file allowed to paint `bg-skeleton`; everything else must go
  through the primitives.
- **No custom type-scale tokens.** The repo uses Tailwind's stock `text-*` utilities, which carry
  their own `--text-*--line-height` in the default theme, so §Loading's rule 4 ("the token carries
  size _and_ line-height") holds without adding `--text-h1`-style tokens to `@theme`.
- **`--color-skeleton` and `--color-ink-deep` are the semantic-colour exceptions**
  (`src/app/globals.css`). `--color-ink-deep: #0a0a0a` exists because the offset ("brutal") shadows
  use a near-black that is deliberately _not_ unified with `--color-ink: #111111`. Every other token
  is palette-named; do not add usage-named colours such as `text-primary`.
- **Colours inside arbitrary values come from `@theme` too**: `shadow-[4px_4px_0_var(--color-ink)]`,
  never `shadow-[4px_4px_0_#111]`. `no-restricted-syntax` rejects a hex literal in `className`.
- **Route-private imports use `@/app/*/**/_*`.** A route group adds a path segment, so
  `@/app/*/_*` never matched `(site)/blog/_components`; and `@/app/**/_*` also flags the root route's
  own `src/app/_components`, which is legal. `*/**` blocks cross-route imports at every depth and
  leaves the own-folder case clean.
- **`eslint-plugin-import` (+ the TypeScript resolver) instead of `eslint-plugin-import-x`.** Same
  `order` rule; the swap is a dependency change and belongs in its own commit, not inside a
  convention refactor. `settings["import/resolver"]` is what makes `@/…` resolve, so the ordering
  rule is real either way.
- **Image hosts are a pair.** `img-src` in `src/proxy.ts`'s CSP and `images.remotePatterns` in
  `next.config.mjs` must list the same hosts. Adding an upload host means editing both, or
  `next/image` rejects a URL the CSP already allows. The CSP itself lives in `src/proxy.ts` (it needs
  a per-request nonce on the request headers); `next.config.mjs` owns the other security headers.
