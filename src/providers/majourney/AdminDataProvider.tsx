"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { deleteBlogPostAction } from "@/actions/blog/delete-blog-post";
import { saveBlogPostAction } from "@/actions/blog/save-blog-post";
import { updateHomeConfigAction } from "@/actions/home-config/update-home-config";
import { updateProfileAction } from "@/actions/profile/update-profile";
import { deleteProjectAction } from "@/actions/projects/delete-project";
import { saveProjectAction } from "@/actions/projects/save-project";
import { createSkillAction } from "@/actions/skills/create-skill";
import { createSkillCategoryAction } from "@/actions/skills/create-skill-category";
import { deleteSkillAction } from "@/actions/skills/delete-skill";
import { deleteSkillCategoryAction } from "@/actions/skills/delete-skill-category";
import { deleteWorkHistoryAction } from "@/actions/work-history/delete-work-history";
import { saveWorkHistoryAction } from "@/actions/work-history/save-work-history";
import { ApiError, adminRequest, publicRequest } from "@/services/admin-api-client";
import type { ActionResult } from "@/lib/action-result";
import type {
  BlogPost,
  HomeConfig,
  ListResponse,
  Profile,
  Project,
  Skill,
  SkillGroup,
  WorkHistory,
} from "@/types/api.types";
import type {
  AdminInitialData,
  AdminSectionErrors,
  BlogPostInput,
  HomeConfigInput,
  ProfileInput,
  ProjectInput,
  WorkHistoryInput,
} from "@/types/admin.types";

import { useAdminAuth } from "./AdminAuthProvider";

type HomeConfigSettings = { totalShowProjects: number; totalShowBlogs: number };

interface AdminDataContextValue {
  loading: boolean;
  errors: AdminSectionErrors;
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
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

interface AdminDataProviderProps {
  /** Fetched in `app/majourney/layout.tsx`, so first paint has data. */
  initialData: AdminInitialData;
  children: ReactNode;
}

export function AdminDataProvider({ initialData, children }: AdminDataProviderProps) {
  const { loggedIn, hydrated, logout } = useAdminAuth();

  const [loading, setLoading] = useState(!initialData.loaded);
  const [errors, setErrors] = useState<AdminSectionErrors>(initialData.errors);

  const [profile, setProfile] = useState<Profile | null>(initialData.profile);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(initialData.skillGroups);
  const [workHistory, setWorkHistory] = useState<WorkHistory[]>(initialData.workHistory);
  const [projects, setProjects] = useState<Project[]>(initialData.projects);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialData.blogPosts);
  const [homeConfig, setHomeConfig] = useState<HomeConfigSettings | null>(
    initialData.homeConfig
      ? {
          totalShowProjects: initialData.homeConfig.totalShowProjects,
          totalShowBlogs: initialData.homeConfig.totalShowBlogs,
        }
      : null,
  );

  /** Turns a failed action into a thrown ApiError, logging out on a dead session. */
  const unwrap = useCallback(
    <T,>(result: ActionResult<T>): T => {
      if (!result.ok) {
        if (result.code === "UNAUTHENTICATED") logout();
        throw new ApiError(400, result.code, result.error);
      }
      return result.data;
    },
    [logout],
  );

  const loadAll = useCallback(async () => {
    if (!hydrated) return;
    if (!loggedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [profileResult, skillsResult, workResult, projectsResult, homeResult, blogResult] =
      await Promise.allSettled([
        publicRequest<Profile>("/profile"),
        publicRequest<ListResponse<SkillGroup>>("/skills"),
        publicRequest<ListResponse<WorkHistory>>("/work-history"),
        publicRequest<ListResponse<Project>>("/projects?limit=100&offset=0"),
        publicRequest<HomeConfig>("/home-config"),
        adminRequest<ListResponse<BlogPost>>("/admin/blog?limit=100&offset=0"),
      ]);

    const nextErrors: AdminSectionErrors = {};
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
  }, [hydrated, loggedIn, logout]);

  /* eslint-disable react-hooks/set-state-in-effect -- fetch after the session read resolves */
  useEffect(
    function loadAdminData() {
      // Server-rendered data is already in state; only fetch when this provider
      // mounted without a session (e.g. right after signing in on /login).
      if (initialData.loaded) return;
      loadAll();
    },
    [initialData.loaded, loadAll],
  );
  /* eslint-enable react-hooks/set-state-in-effect */

  const updateProfile = useCallback(
    async (payload: ProfileInput) => {
      setProfile(unwrap(await updateProfileAction(payload)));
    },
    [unwrap],
  );

  const createCategory = useCallback(
    async (name: string) => {
      const category = unwrap(await createSkillCategoryAction(name));
      setSkillGroups((prev) => [...prev, { id: category.id, name: category.name, skills: [] }]);
    },
    [unwrap],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      unwrap(await deleteSkillCategoryAction(id));
      setSkillGroups((prev) => prev.filter((c) => c.id !== id));
    },
    [unwrap],
  );

  const createSkill = useCallback(
    async (categoryId: string, name: string) => {
      const skill = unwrap(await createSkillAction(categoryId, name));
      setSkillGroups((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, skills: [...c.skills, { id: skill.id, name: skill.name }] }
            : c,
        ),
      );
    },
    [unwrap],
  );

  const deleteSkill = useCallback(
    async (categoryId: string, skillId: string) => {
      unwrap(await deleteSkillAction(skillId));
      setSkillGroups((prev) =>
        prev.map((c) =>
          c.id === categoryId ? { ...c, skills: c.skills.filter((s) => s.id !== skillId) } : c,
        ),
      );
    },
    [unwrap],
  );

  const createWork = useCallback(
    async (payload: WorkHistoryInput) => {
      const created = unwrap(await saveWorkHistoryAction({ values: payload }));
      setWorkHistory((prev) => [...prev, created]);
    },
    [unwrap],
  );

  const updateWork = useCallback(
    async (id: string, payload: WorkHistoryInput) => {
      const updated = unwrap(await saveWorkHistoryAction({ id, values: payload }));
      setWorkHistory((prev) => prev.map((w) => (w.id === id ? updated : w)));
    },
    [unwrap],
  );

  const deleteWork = useCallback(
    async (id: string) => {
      unwrap(await deleteWorkHistoryAction(id));
      setWorkHistory((prev) => prev.filter((w) => w.id !== id));
    },
    [unwrap],
  );

  const createProject = useCallback(
    async (payload: ProjectInput) => {
      const created = unwrap(await saveProjectAction({ values: payload }));
      setProjects((prev) => [...prev, created]);
    },
    [unwrap],
  );

  const updateProject = useCallback(
    async (id: string, payload: ProjectInput) => {
      const updated = unwrap(await saveProjectAction({ id, values: payload }));
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    },
    [unwrap],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      unwrap(await deleteProjectAction({ id }));
      setProjects((prev) => prev.filter((p) => p.id !== id));
    },
    [unwrap],
  );

  const createBlogPost = useCallback(
    async (payload: BlogPostInput) => {
      const created = unwrap(await saveBlogPostAction({ values: payload }));
      setBlogPosts((prev) => [...prev, created]);
    },
    [unwrap],
  );

  const updateBlogPost = useCallback(
    async (id: string, payload: BlogPostInput) => {
      const updated = unwrap(await saveBlogPostAction({ id, values: payload }));
      setBlogPosts((prev) => prev.map((b) => (b.id === id ? updated : b)));
    },
    [unwrap],
  );

  const deleteBlogPost = useCallback(
    async (id: string) => {
      unwrap(await deleteBlogPostAction({ id }));
      setBlogPosts((prev) => prev.filter((b) => b.id !== id));
    },
    [unwrap],
  );

  const updateHomeConfig = useCallback(
    async (payload: HomeConfigInput) => {
      setHomeConfig(unwrap(await updateHomeConfigAction(payload)));
    },
    [unwrap],
  );

  const allSkills = useMemo(
    () =>
      skillGroups.flatMap((group) =>
        group.skills.map((skill) => ({ ...skill, categoryName: group.name })),
      ),
    [skillGroups],
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

export default AdminDataProvider;
