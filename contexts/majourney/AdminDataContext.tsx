"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAdminAuth } from "./AdminAuthContext";
import { ApiError, adminRequest, publicRequest } from "@/lib/majourney/api-client";
import type {
  BlogPost,
  HomeConfig,
  ListResponse,
  Profile,
  Project,
  Skill,
  SkillGroup,
  WorkHistory,
} from "@/lib/api-types";
import type {
  BlogPostInput,
  HomeConfigInput,
  ProfileInput,
  ProjectInput,
  WorkHistoryInput,
} from "@/lib/majourney/inputs";

type HomeConfigSettings = { totalShowProjects: number; totalShowBlogs: number };

/**
 * Per-section load errors. A resource missing here just means it loaded fine
 * (or, for the `profile`/`homeConfig` singletons, that the row simply hasn't
 * been created yet — a normal first-run state, not an error).
 */
type SectionErrors = {
  profile?: string;
  skills?: string;
  workHistory?: string;
  projects?: string;
  blog?: string;
  homeConfig?: string;
};

type AdminDataContextValue = {
  loading: boolean;
  errors: SectionErrors;
  refresh: () => void;

  profile: Profile | null;
  updateProfile: (payload: ProfileInput) => Promise<void>;

  skillGroups: SkillGroup[];
  allSkills: (Skill & { categoryName: string })[];
  createCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  createSkill: (categoryId: string, name: string) => Promise<void>;
  deleteSkill: (categoryId: string, skillId: string) => Promise<void>;

  workHistory: WorkHistory[];
  createWork: (payload: WorkHistoryInput) => Promise<void>;
  updateWork: (id: string, payload: WorkHistoryInput) => Promise<void>;
  deleteWork: (id: string) => Promise<void>;

  projects: Project[];
  createProject: (payload: ProjectInput) => Promise<void>;
  updateProject: (id: string, payload: ProjectInput) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  blogPosts: BlogPost[];
  createBlogPost: (payload: BlogPostInput) => Promise<void>;
  updateBlogPost: (id: string, payload: BlogPostInput) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;

  homeConfig: HomeConfigSettings | null;
  updateHomeConfig: (payload: HomeConfigInput) => Promise<void>;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const { token, hydrated, logout } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<SectionErrors>({});

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [workHistory, setWorkHistory] = useState<WorkHistory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [homeConfig, setHomeConfig] = useState<HomeConfigSettings | null>(null);

  /** Runs a mutation, logging out automatically if the token was rejected/expired. */
  const withAuthHandling = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      try {
        return await fn();
      } catch (err) {
        if (err instanceof ApiError && err.isAuthError) logout();
        throw err;
      }
    },
    [logout]
  );

  const loadAll = useCallback(async () => {
    if (!hydrated) return;
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const [profileResult, skillsResult, workResult, projectsResult, homeResult, blogResult] =
      await Promise.allSettled([
        publicRequest<Profile>("/api/profile"),
        publicRequest<ListResponse<SkillGroup>>("/api/skills"),
        publicRequest<ListResponse<WorkHistory>>("/api/work-history"),
        publicRequest<ListResponse<Project>>("/api/projects?limit=100&offset=0"),
        publicRequest<HomeConfig>("/api/home-config"),
        adminRequest<ListResponse<BlogPost>>("/api/admin/blog?limit=100&offset=0", token),
      ]);

    const nextErrors: SectionErrors = {};
    const messageFor = (reason: unknown, fallback: string) =>
      reason instanceof ApiError ? reason.message : fallback;

    // profile and home-config are singleton rows (schema doc, §2.2) that may
    // simply not have been created yet on a fresh database — a 404 there is
    // a normal first-run state, not a load failure, so it isn't surfaced as
    // an error; any other failure still is.
    if (profileResult.status === "fulfilled") {
      setProfile(profileResult.value);
    } else {
      setProfile(null);
      if (!(profileResult.reason instanceof ApiError && profileResult.reason.status === 404)) {
        nextErrors.profile = messageFor(profileResult.reason, "Failed to load profile.");
      }
    }

    if (skillsResult.status === "fulfilled") {
      setSkillGroups(skillsResult.value.items);
    } else {
      nextErrors.skills = messageFor(skillsResult.reason, "Failed to load skills.");
    }

    if (workResult.status === "fulfilled") {
      setWorkHistory(workResult.value.items);
    } else {
      nextErrors.workHistory = messageFor(workResult.reason, "Failed to load work history.");
    }

    if (projectsResult.status === "fulfilled") {
      setProjects(projectsResult.value.items);
    } else {
      nextErrors.projects = messageFor(projectsResult.reason, "Failed to load projects.");
    }

    if (homeResult.status === "fulfilled") {
      setHomeConfig({
        totalShowProjects: homeResult.value.totalShowProjects,
        totalShowBlogs: homeResult.value.totalShowBlogs,
      });
    } else {
      setHomeConfig(null);
      if (!(homeResult.reason instanceof ApiError && homeResult.reason.status === 404)) {
        nextErrors.homeConfig = messageFor(homeResult.reason, "Failed to load home config.");
      }
    }

    if (blogResult.status === "fulfilled") {
      setBlogPosts(blogResult.value.items);
    } else {
      nextErrors.blog = messageFor(blogResult.reason, "Failed to load blog posts.");
      if (blogResult.reason instanceof ApiError && blogResult.reason.isAuthError) logout();
    }

    setErrors(nextErrors);
    setLoading(false);
  }, [hydrated, token, logout]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const updateProfile = useCallback(
    async (payload: ProfileInput) => {
      const updated = await withAuthHandling(() =>
        adminRequest<Profile>("/api/admin/profile", token, { method: "PUT", body: payload })
      );
      setProfile(updated);
    },
    [token, withAuthHandling]
  );

  const createCategory = useCallback(
    async (name: string) => {
      const category = await withAuthHandling(() =>
        adminRequest<{ id: string; name: string }>("/api/admin/skill-categories", token, {
          method: "POST",
          body: { name },
        })
      );
      setSkillGroups((prev) => [...prev, { id: category.id, name: category.name, skills: [] }]);
    },
    [token, withAuthHandling]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      await withAuthHandling(() =>
        adminRequest<void>(`/api/admin/skill-categories/${id}`, token, { method: "DELETE" })
      );
      setSkillGroups((prev) => prev.filter((c) => c.id !== id));
    },
    [token, withAuthHandling]
  );

  const createSkill = useCallback(
    async (categoryId: string, name: string) => {
      const skill = await withAuthHandling(() =>
        adminRequest<{ id: string; name: string; categoryId: string }>("/api/admin/skills", token, {
          method: "POST",
          body: { categoryId, name },
        })
      );
      setSkillGroups((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, skills: [...c.skills, { id: skill.id, name: skill.name }] } : c))
      );
    },
    [token, withAuthHandling]
  );

  const deleteSkill = useCallback(
    async (categoryId: string, skillId: string) => {
      await withAuthHandling(() =>
        adminRequest<void>(`/api/admin/skills/${skillId}`, token, { method: "DELETE" })
      );
      setSkillGroups((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, skills: c.skills.filter((s) => s.id !== skillId) } : c))
      );
    },
    [token, withAuthHandling]
  );

  const createWork = useCallback(
    async (payload: WorkHistoryInput) => {
      const created = await withAuthHandling(() =>
        adminRequest<WorkHistory>("/api/admin/work-history", token, { method: "POST", body: payload })
      );
      setWorkHistory((prev) => [...prev, created]);
    },
    [token, withAuthHandling]
  );

  const updateWork = useCallback(
    async (id: string, payload: WorkHistoryInput) => {
      const updated = await withAuthHandling(() =>
        adminRequest<WorkHistory>(`/api/admin/work-history/${id}`, token, { method: "PUT", body: payload })
      );
      setWorkHistory((prev) => prev.map((w) => (w.id === id ? updated : w)));
    },
    [token, withAuthHandling]
  );

  const deleteWork = useCallback(
    async (id: string) => {
      await withAuthHandling(() =>
        adminRequest<void>(`/api/admin/work-history/${id}`, token, { method: "DELETE" })
      );
      setWorkHistory((prev) => prev.filter((w) => w.id !== id));
    },
    [token, withAuthHandling]
  );

  const createProject = useCallback(
    async (payload: ProjectInput) => {
      const created = await withAuthHandling(() =>
        adminRequest<Project>("/api/admin/projects", token, { method: "POST", body: payload })
      );
      setProjects((prev) => [...prev, created]);
    },
    [token, withAuthHandling]
  );

  const updateProject = useCallback(
    async (id: string, payload: ProjectInput) => {
      const updated = await withAuthHandling(() =>
        adminRequest<Project>(`/api/admin/projects/${id}`, token, { method: "PUT", body: payload })
      );
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    },
    [token, withAuthHandling]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      await withAuthHandling(() => adminRequest<void>(`/api/admin/projects/${id}`, token, { method: "DELETE" }));
      setProjects((prev) => prev.filter((p) => p.id !== id));
    },
    [token, withAuthHandling]
  );

  const createBlogPost = useCallback(
    async (payload: BlogPostInput) => {
      // Create defaults to draft server-side — status isn't accepted until update.
      const { status: _status, ...createPayload } = payload;
      const created = await withAuthHandling(() =>
        adminRequest<BlogPost>("/api/admin/blog", token, { method: "POST", body: createPayload })
      );
      setBlogPosts((prev) => [...prev, created]);
    },
    [token, withAuthHandling]
  );

  const updateBlogPost = useCallback(
    async (id: string, payload: BlogPostInput) => {
      const updated = await withAuthHandling(() =>
        adminRequest<BlogPost>(`/api/admin/blog/${id}`, token, { method: "PUT", body: payload })
      );
      setBlogPosts((prev) => prev.map((b) => (b.id === id ? updated : b)));
    },
    [token, withAuthHandling]
  );

  const deleteBlogPost = useCallback(
    async (id: string) => {
      await withAuthHandling(() => adminRequest<void>(`/api/admin/blog/${id}`, token, { method: "DELETE" }));
      setBlogPosts((prev) => prev.filter((b) => b.id !== id));
    },
    [token, withAuthHandling]
  );

  const updateHomeConfig = useCallback(
    async (payload: HomeConfigInput) => {
      const updated = await withAuthHandling(() =>
        adminRequest<HomeConfigSettings>("/api/admin/home-config", token, { method: "PUT", body: payload })
      );
      setHomeConfig(updated);
    },
    [token, withAuthHandling]
  );

  const allSkills = useMemo(
    () =>
      skillGroups.flatMap((group) => group.skills.map((skill) => ({ ...skill, categoryName: group.name }))),
    [skillGroups]
  );

  return (
    <AdminDataContext.Provider
      value={{
        loading,
        errors,
        refresh: loadAll,
        profile,
        updateProfile,
        skillGroups,
        allSkills,
        createCategory,
        deleteCategory,
        createSkill,
        deleteSkill,
        workHistory,
        createWork,
        updateWork,
        deleteWork,
        projects,
        createProject,
        updateProject,
        deleteProject,
        blogPosts,
        createBlogPost,
        updateBlogPost,
        deleteBlogPost,
        homeConfig,
        updateHomeConfig,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
