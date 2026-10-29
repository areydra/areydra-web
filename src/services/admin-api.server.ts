import "server-only";

import { readSessionCookie } from "@/lib/session.server";
import { ApiError } from "@/services/admin-api-client";

/**
 * Server-side admin client used by Server Actions.
 *
 * An action runs on the Next server, so it can reach `api.areydra.com`
 * server-to-server: no CORS, no preflight, no browser in the mutation path. The
 * caller's session cookie is forwarded verbatim, which is what keeps the API's
 * own authorization (per session, per resource) in force — this layer must never
 * decide authority on its own.
 */
export async function adminApi<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  // Read per call, not at module load: the value must reflect the running server.
  const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new ApiError(0, "CONFIG_ERROR", "The API base URL is not configured.");
  }

  const cookie = await readSessionCookie();
  if (!cookie) {
    throw new ApiError(401, "UNAUTHENTICATED", "Your session expired. Sign in again.");
  }

  const { method = "GET", body } = options;
  const headers: Record<string, string> = { Accept: "application/json", Cookie: cookie };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(new URL(path, apiBaseUrl).toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Could not reach the API. Try again.");
  }

  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();
  const json = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const envelope = json as { error?: { code?: string; message?: string } } | null;
    throw new ApiError(
      response.status,
      envelope?.error?.code ?? "UNKNOWN_ERROR",
      envelope?.error?.message ?? `Request failed with status ${response.status}.`,
    );
  }

  return json as T;
}
