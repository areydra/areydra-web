import "server-only";

import { cookies } from "next/headers";

/**
 * Read-only view of the admin session cookie, for Server Actions and Server
 * Components. Nothing here can create or clear the cookie — the API owns its
 * lifecycle; this only reads what the browser sent so it can be forwarded.
 */
export const SESSION_COOKIE = "__Host-session";

export async function readSessionCookie(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  return value ? `${SESSION_COOKIE}=${encodeURIComponent(value)}` : null;
}
