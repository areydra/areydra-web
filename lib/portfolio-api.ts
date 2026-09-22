import "server-only";
import type {
  ApiResult,
  HomeConfig,
  HomeData,
  ListResponse,
  Profile,
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
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    return {
      data: null,
      error: "Missing API_BASE_URL environment variable.",
    };
  }

  try {
    const response = await fetch(new URL(path, baseUrl), {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
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
    fetchJson<Profile>("/api/profile"),
    fetchJson<ListResponse<SkillGroup>>("/api/skills"),
    fetchJson<ListResponse<WorkHistory>>("/api/work-history"),
    fetchJson<HomeConfig>("/api/home-config"),
  ]);

  return { profile, skills, workHistory, homeConfig };
}
