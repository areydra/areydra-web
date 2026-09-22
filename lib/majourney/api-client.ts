/**
 * Browser-side client for the areydra-be backend.
 *
 * Per the backend's technical design doc, the frontend and backend are
 * deployed on unrelated domains and auth is a Bearer JWT attached manually
 * per request (not a cookie) — so this client calls the backend's absolute
 * URL directly from the browser rather than proxying through Next.js.
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
    throw new ApiError(
      0,
      "CONFIG_ERROR",
      "Missing NEXT_PUBLIC_API_BASE_URL environment variable."
    );
  }
  return baseUrl;
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  const { method = "GET", body, token } = options;
  const baseUrl = getApiBaseUrl();

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(new URL(path, baseUrl), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
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
export function publicRequest<T>(path: string, options?: { method?: string; body?: unknown }) {
  return request<T>(path, options);
}

/** Bearer-authenticated request to an admin endpoint. */
export function adminRequest<T>(
  path: string,
  token: string | null,
  options?: { method?: string; body?: unknown }
) {
  return request<T>(path, { ...options, token });
}

export { getApiBaseUrl };
