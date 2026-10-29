import "server-only";

import { cache } from "react";

import type {
  ApiResult,
  BlogPost,
  HomeConfig,
  HomeData,
  ListResponse,
  Profile,
  Project,
  SkillGroup,
  WorkHistory,
} from "@/types/api.types";

export type {
  ApiResult,
  Profile,
  AboutPoint,
  SkillGroup,
  Skill,
  ListResponse,
  WorkHistory,
  WorkStatus,
  Project,
  ProjectTech,
  ProjectImage,
  BlogStatus,
  BlogPost,
  BlogTag,
  HomeConfig,
  HomeData,
} from "@/types/api.types";

async function fetchJson<T>(path: string): Promise<ApiResult<T>> {
  // Server-side requests run inside the web container, where the backend is
  // reachable by its compose service name (API_BASE_URL). Browser-side code
  // (majourney admin panel) uses the host-reachable NEXT_PUBLIC_ URL instead.
  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return {
      data: null,
      error: "Missing NEXT_PUBLIC_API_BASE_URL environment variable.",
    };
  }

  try {
    const response = await fetch(new URL(path, baseUrl), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: null,
        error: `Request failed with ${response.status} ${response.statusText}.`,
      };
    }

    return { data: (await response.json()) as T, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown API request error.",
    };
  }
}

export async function getHomeData(): Promise<HomeData> {
  const [profile, skills, workHistory, homeConfig] = await Promise.all([
    fetchJson<Profile>("/profile"),
    fetchJson<ListResponse<SkillGroup>>("/skills"),
    fetchJson<ListResponse<WorkHistory>>("/work-history"),
    fetchJson<HomeConfig>("/home-config"),
  ]);

  return { profile, skills, workHistory, homeConfig };
}

export async function getBlogPosts(): Promise<ApiResult<ListResponse<BlogPost>>> {
  // Same limit the admin panel already uses for its own blog list
  // (`AdminDataContext`'s `/admin/blog?limit=100&offset=0`) and the
  // backend's max allowed `limit` — no pagination UI exists yet, so this
  // fetches every published post in one call.
  return fetchJson<ListResponse<BlogPost>>("/blog?limit=100&offset=0");
}

/** Every published project — used by the generated sitemap. */
export async function getProjects(): Promise<ApiResult<ListResponse<Project>>> {
  return fetchJson<ListResponse<Project>>("/projects?limit=100&offset=0");
}

/** `cache` dedupes the read between `generateMetadata` and the page render. */
export const getBlogPostBySlug = cache(async (slug: string): Promise<ApiResult<BlogPost>> =>
  fetchJson<BlogPost>(`/blog/${encodeURIComponent(slug)}`),
);

/** `cache` dedupes the read between `generateMetadata` and the page render. */
export const getProjectBySlug = cache(async (slug: string): Promise<ApiResult<Project>> =>
  fetchJson<Project>(`/projects/${encodeURIComponent(slug)}`),
);
