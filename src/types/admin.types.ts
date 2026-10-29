import type { BlogStatus, WorkStatus } from "@/types/api.types";
import type {
  BlogPost,
  HomeConfig,
  Profile,
  Project,
  SkillGroup,
  WorkHistory,
} from "@/types/api.types";

/** The signed-in admin, as returned by the API session endpoints. */
export interface AdminUser {
  id: string;
  email: string;
  name?: string;
}

/**
 * Per-section load errors. A resource missing here means it loaded fine (or, for
 * the `profile`/`homeConfig` singletons, that the row has not been created yet —
 * a normal first-run state, not an error).
 */
export interface AdminSectionErrors {
  profile?: string;
  skills?: string;
  workHistory?: string;
  projects?: string;
  blog?: string;
  homeConfig?: string;
}

/** Everything the panel needs on first paint, fetched on the server. */
export interface AdminInitialData {
  /** True when the request carried a session, so the client can skip its own fetch. */
  loaded: boolean;
  profile: Profile | null;
  skillGroups: SkillGroup[];
  workHistory: WorkHistory[];
  projects: Project[];
  blogPosts: BlogPost[];
  homeConfig: HomeConfig | null;
  errors: AdminSectionErrors;
}

/** Editable payload for `PUT /api/admin/profile`. */
export interface ProfileInput {
  name: string;
  role: string;
  tagline: string;
  avatarUrl: string | null;
  aboutTitle: string;
  aboutDescription: string;
  aboutPoints: { title: string; description: string; sortOrder: number }[];
  github: string | null;
  linkedin: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
}

/** Editable payload for the work-history create/update endpoints. */
export interface WorkHistoryInput {
  company: string;
  role: string;
  status: WorkStatus;
  description: string;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  companyLogoUrl: string | null;
}

/** Editable payload for the project create/update endpoints. */
export interface ProjectInput {
  title: string;
  description: string;
  role: string;
  githubUrl: string | null;
  liveUrl: string | null;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  projectDate: string | null;
  thumbnailUrl: string | null;
  skillIds: string[];
  images: { imageUrl: string; sortOrder: number }[];
}

/** Editable payload for the blog create/update endpoints. */
export interface BlogPostInput {
  title: string;
  content: string;
  category: string | null;
  tagNames: string[];
  thumbnailUrl: string | null;
  status: BlogStatus;
}

/** Settings payload for `PUT /api/admin/home-config`. */
export interface HomeConfigInput {
  totalShowProjects: number;
  totalShowBlogs: number;
}
