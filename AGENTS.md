# Frontend code convention

This repo follows **`conventions/frontend-web-code-convention`** in gbrain (v1.4.0) — load that
page before writing or reviewing app code. This file is only a pointer; never fork the convention
into a local copy.

Gates that must pass before any change is done: `npm run verify`
(`typecheck` → `lint` → `format:check` → `test` → `build`).

## Project overrides

These deviate from the generic pattern on purpose. Do not "fix" them back without reading why:

- **Homepage chrome lives in `HomeShell`, not `(site)/layout.tsx`.** The invert filter has to wrap
  the nav and the content together, so `/` stays outside the `(site)` route group while blog and
  project routes take their chrome from the layout.
- **No Zustand, no TanStack Query.** The admin session is an httpOnly `__Host-session` cookie set by
  `api.areydra.com`. Panel data is fetched on the server in `app/majourney/layout.tsx`
  (`services/admin-data.server.ts`) and handed to the client as initial state; writes run as Server
  Actions (`src/actions/<domain>/*.ts` → `adminApi()`), which forward the caller's cookie
  server-to-server. The only browser→API call left is the `/auth/session` check. This depends on
  `api.areydra.com` staying on the `areydra.com` site — see `docs/backend-session-migration.md`.
  Nothing session-shaped may go back into `localStorage`.
- **`--color-skeleton` is the one semantic colour token** (`src/app/globals.css`). Every other token
  is palette-named; do not add usage-named colours such as `text-primary`.
- **Image hosts are a pair.** `img-src` in `next.config.mjs`'s CSP and `images.remotePatterns` must
  list the same hosts. Adding an upload host means editing both, or `next/image` rejects a URL the
  CSP already allows.
