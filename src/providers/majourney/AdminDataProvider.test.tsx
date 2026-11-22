import { act, render } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

const { logout } = vi.hoisted(() => ({ logout: vi.fn() }));

vi.mock("./AdminAuthProvider", () => ({
  useAdminAuth: () => ({
    loggedIn: true,
    hydrated: true,
    user: { id: "1", email: "admin@example.test", name: "Admin" },
    logout,
  }),
}));

import type { AdminInitialData, BlogPostInput } from "@/types/admin.types";

import { AdminDataProvider, useAdminData } from "./AdminDataProvider";

const initialData: AdminInitialData = {
  loaded: false,
  profile: null,
  skillGroups: [],
  workHistory: [],
  projects: [],
  blogPosts: [],
  homeConfig: null,
  errors: {},
};

const payload: BlogPostInput = {
  title: "A post",
  content: "Body",
  category: null,
  tagNames: [],
  thumbnailUrl: null,
  status: "draft",
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

function Probe({ onSubmit }: { onSubmit: (submit: () => Promise<void>) => void }) {
  const { createBlogPost } = useAdminData();
  useEffect(() => {
    onSubmit(() => createBlogPost(payload));
  }, [createBlogPost, onSubmit]);
  return null;
}

describe("admin mutations", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let submit: () => Promise<void>;

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test");
    fetchMock = vi
      .fn()
      .mockImplementation((_url: string, init?: RequestInit) =>
        Promise.resolve(
          jsonResponse(init?.method && init.method !== "GET" ? { id: "post-1" } : { items: [] }),
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    submit = async () => {};
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  const mount = () =>
    render(
      <AdminDataProvider initialData={initialData}>
        <Probe onSubmit={(fn) => (submit = fn)} />
      </AdminDataProvider>,
    );

  it("sends blog creation to the API host with the session cookie", async () => {
    mount();
    await act(async () => {
      await submit();
    });

    const call = fetchMock.mock.calls.find(
      ([, init]) => (init as RequestInit | undefined)?.method === "POST",
    );
    expect(call).toBeDefined();
    const [url, init] = call as [string, RequestInit];
    expect(url).toBe("https://api.example.test/admin/blog");
    expect(init.credentials).toBe("include");
    expect(new Headers(init.headers).get("Authorization")).toBeNull();
    expect(JSON.parse(String(init.body))).not.toHaveProperty("status");
  });

  it("logs out when the API rejects the mutation as unauthenticated", async () => {
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      Promise.resolve(
        init?.method && init.method !== "GET"
          ? jsonResponse({ error: { code: "UNAUTHENTICATED", message: "Sign in again." } }, 401)
          : jsonResponse({ items: [] }),
      ),
    );
    mount();
    await act(async () => {
      await expect(submit()).rejects.toThrow("Sign in again.");
    });

    expect(logout).toHaveBeenCalledOnce();
  });
});
