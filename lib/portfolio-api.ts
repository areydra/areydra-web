import "server-only";
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
} from "./api-types";

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
} from "./api-types";

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
      cache: 'no-store'
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

export async function getBlogPostBySlug(slug: string): Promise<ApiResult<BlogPost>> {
  return fetchJson<BlogPost>(`/blog/${encodeURIComponent(slug)}`);
}

export async function getProjectBySlug(slug: string): Promise<ApiResult<Project>> {
  return fetchJson<Project>(`/projects/${encodeURIComponent(slug)}`);
}
