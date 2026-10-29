/**
 * Browser client for `areydra-be`.
 *
 * The admin session is an httpOnly cookie set by the API on `api.areydra.com`.
 * The frontend lives on `areydra.com` — cross-origin but **same-site** — so
 * `credentials: "include"` is the whole transport story: the browser attaches
 * the cookie, the API validates it per request, and JavaScript never sees a
 * token. (Cross-*site* would change this; that is what the BFF was for.)
 */

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  /** True when the backend rejected the request as unauthenticated/expired. */
  get isAuthError() {
    return this.status === 401;
  }
}

function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new ApiError(0, "CONFIG_ERROR", "Missing NEXT_PUBLIC_API_BASE_URL environment variable.");
  }
  return baseUrl;
}

async function send<T>(
  path: string,
  options: { method?: string; body?: unknown; credentials?: RequestCredentials } = {},
): Promise<T> {
  const { method = "GET", body, credentials } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  // Resolved before the try: a missing base URL is a config error, not a
  // transport failure, and must not be reported as NETWORK_ERROR.
  const target = new URL(path, getApiBaseUrl()).toString();

  let response: Response;
  try {
    response = await fetch(target, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...(credentials ? { credentials } : {}),
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Could not reach the API. Check your connection.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const json = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const code = json?.error?.code ?? "UNKNOWN_ERROR";
    const message = json?.error?.message ?? `Request failed with status ${response.status}.`;
    throw new ApiError(response.status, code, message);
  }

  return json as T;
}

/** Unauthenticated request to a public endpoint. */
export async function publicRequest<T>(
  path: string,
  options?: { method?: string; body?: unknown },
) {
  return send<T>(path, options);
}

/**
 * Authenticated request. No token argument: the API is same-site, the cookie is
 * httpOnly, and `credentials: "include"` is what makes the browser attach it.
 */
export async function adminRequest<T>(path: string, options?: { method?: string; body?: unknown }) {
  return send<T>(path, { ...options, credentials: "include" });
}

export { getApiBaseUrl };
