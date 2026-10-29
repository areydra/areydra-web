import "server-only";

import { htmlToMarkdown } from "@/lib/html-to-markdown";
import { readSessionCookie } from "@/lib/session.server";
import { adminApi } from "@/services/admin-api.server";
import { getHomeData, getProjects } from "@/services/portfolio-service.server";
import type { AdminInitialData, AdminSectionErrors } from "@/types/admin.types";
import type { BlogPost, ListResponse } from "@/types/api.types";

const EMPTY: AdminInitialData = {
  loaded: false,
  profile: null,
  skillGroups: [],
  workHistory: [],
  projects: [],
  blogPosts: [],
  homeConfig: null,
  errors: {},
};

/**
 * Loads the admin panel's data on the server, so the first paint already has
 * content and the browser makes no data fetches at all.
 *
 * Unauthenticated requests get the empty shape rather than an error: the login
 * route renders under the same layout, and the API is the authority on whether
 * any of this is readable (the admin call below forwards the cookie and returns
 * 401 without one).
 */
export async function getAdminInitialData(): Promise<AdminInitialData> {
  const session = await readSessionCookie();
  if (!session) return EMPTY;

  const [home, projects, blog] = await Promise.all([
    getHomeData(),
    getProjects(),
    adminApi<ListResponse<BlogPost>>("/admin/blog?limit=100&offset=0").catch(() => null),
  ]);

  const errors: AdminSectionErrors = {};
  if (home.profile.error) errors.profile = home.profile.error;
  if (home.skills.error) errors.skills = home.skills.error;
  if (home.workHistory.error) errors.workHistory = home.workHistory.error;
  if (projects.error) errors.projects = projects.error;
  if (home.homeConfig.error) errors.homeConfig = home.homeConfig.error;
  // A 401 here means the session died between the layout and this call; the
  // client gate handles the redirect, so it is reported like any other failure.
  if (!blog) errors.blog = "Could not load the blog list.";

  return {
    loaded: true,
    profile: home.profile.data,
    skillGroups: home.skills.data?.items ?? [],
    workHistory: home.workHistory.data?.items ?? [],
    // Descriptions written before the markdown editor are HTML in the same column.
    // Handing them to MDXEditor would show the tags as literal text and save them
    // that way, so they are converted once, here, on the server. Idempotent for
    // rows that are already markdown.
    projects: (projects.data?.items ?? []).map((project) => ({
      ...project,
      description: htmlToMarkdown(project.description),
    })),
    blogPosts: blog?.items ?? [],
    homeConfig: home.homeConfig.data,
    errors,
  };
}
