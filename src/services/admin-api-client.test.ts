import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { adminRequest, ApiError, publicRequest } from "./admin-api-client";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const firstCall = (fetchMock: ReturnType<typeof vi.fn>) => {
  const call = fetchMock.mock.calls[0];
  if (!call) throw new Error("fetch was not called");
  const [url, init] = call as [URL, RequestInit | undefined];
  return { url, init };
};

describe("admin api client", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("attaches the bearer token to admin requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await adminRequest<{ ok: boolean }>("/admin/blog", "token-123");

    const { url, init } = firstCall(fetchMock);
    expect(url.toString()).toBe("https://api.example.test/admin/blog");
    expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer token-123");
  });

  it("never sends an authorization header for public requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await publicRequest("/profile");

    const { init } = firstCall(fetchMock);
    expect(new Headers(init?.headers).get("Authorization")).toBeNull();
    expect(init?.body).toBeUndefined();
  });

  it("maps an error envelope to ApiError and flags auth failures", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ error: { code: "UNAUTHORIZED", message: "Token expired" } }, 401));
    vi.stubGlobal("fetch", fetchMock);

    const failure = adminRequest("/admin/profile", "expired").catch((error: unknown) => error);
    const error = await failure;

    expect(error).toBeInstanceOf(ApiError);
    if (!(error instanceof ApiError)) throw new Error("expected ApiError");
    expect(error.status).toBe(401);
    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.message).toBe("Token expired");
    expect(error.isAuthError).toBe(true);
  });

  it("turns a transport failure into a network ApiError", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    vi.stubGlobal("fetch", fetchMock);

    const error = await publicRequest("/profile").catch((failure: unknown) => failure);

    expect(error).toBeInstanceOf(ApiError);
    if (!(error instanceof ApiError)) throw new Error("expected ApiError");
    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.isAuthError).toBe(false);
  });

  it("returns undefined for 204 responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(adminRequest("/admin/blog/1", "token")).resolves.toBeUndefined();
  });

  it("fails loudly when the API base URL is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");

    const error = await publicRequest("/profile").catch((failure: unknown) => failure);

    expect(error).toBeInstanceOf(ApiError);
    if (!(error instanceof ApiError)) throw new Error("expected ApiError");
    expect(error.code).toBe("CONFIG_ERROR");
  });
});
