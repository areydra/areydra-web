import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// `server-only` throws outside a React Server environment, and the cookie read
// is a Next runtime API: both are stubbed so the transport itself can be tested.
vi.mock("server-only", () => ({}));
const { readCookie } = vi.hoisted(() => ({ readCookie: vi.fn() }));
vi.mock("@/lib/session.server", () => ({ readSessionCookie: readCookie }));

import { ApiError } from "@/lib/admin-api-client";

import { adminApi } from "./admin-api.server";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("server-side admin api", () => {
  beforeEach(() => {
    vi.stubEnv("API_BASE_URL", "https://api.example.test");
    readCookie.mockResolvedValue("__Host-session=abc123");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("forwards the session cookie and never an Authorization header", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 1 }));
    vi.stubGlobal("fetch", fetchMock);

    await adminApi("/admin/profile", { method: "PUT", body: { name: "Areydra" } });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.test/admin/profile");
    expect(init.method).toBe("PUT");
    expect(new Headers(init.headers).get("cookie")).toBe("__Host-session=abc123");
    expect(new Headers(init.headers).get("authorization")).toBeNull();
  });

  it("refuses to reach the API without a session", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    readCookie.mockResolvedValue(null);

    const error = await adminApi("/admin/profile", { method: "PUT" }).catch(
      (failure: unknown) => failure,
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(error).toBeInstanceOf(ApiError);
    if (!(error instanceof ApiError)) throw new Error("expected ApiError");
    expect(error.status).toBe(401);
    expect(error.code).toBe("UNAUTHENTICATED");
  });

  it("surfaces the API's error code so the action can report it", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ error: { code: "VALIDATION_ERROR", message: "Name is required." } }, 422),
      );
    vi.stubGlobal("fetch", fetchMock);

    const error = await adminApi("/admin/profile", { method: "PUT", body: {} }).catch(
      (failure: unknown) => failure,
    );

    expect(error).toBeInstanceOf(ApiError);
    if (!(error instanceof ApiError)) throw new Error("expected ApiError");
    expect(error.status).toBe(422);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.message).toBe("Name is required.");
  });

  it("returns null for a 204", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

    await expect(adminApi("/admin/projects/1", { method: "DELETE" })).resolves.toBeNull();
  });
});
