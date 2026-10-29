export type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

export interface Profile {
  id: number;
  name: string;
  role: string;
  tagline: string;
  avatarUrl: string | null;
  aboutTitle: string;
  aboutDescription: string;
  aboutPoints: AboutPoint[];
  github: string | null;
  linkedin: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  yearsOfExperience: number;
  totalCompanies: number;
  createdAt: string;
  updatedAt: string;
}

export interface AboutPoint {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface SkillGroup {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
}

export type ListResponse<T> = {
  items: T[];
  total: number;
};

export type WorkStatus = "full_time" | "freelance" | "contract" | "part_time" | "internship";

export interface WorkHistory {
  id: string;
  company: string;
  companyLogoUrl: string | null;
  role: string;
  status: WorkStatus;
  description: string;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  role: string;
  githubUrl: string | null;
  liveUrl: string | null;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  projectDate: string | null;
  techStack: ProjectTech[];
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTech {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
}

export interface ProjectImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  wordCount: number;
  timeToReadMinutes: number;
  thumbnailUrl: string | null;
  category: string | null;
  tags: BlogTag[];
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTag {
  id: string;
  name: string;
}

export interface HomeConfig {
  totalShowProjects: number;
  totalShowBlogs: number;
  projects: Project[];
  posts: BlogPost[];
}

export interface HomeData {
  profile: ApiResult<Profile>;
  skills: ApiResult<ListResponse<SkillGroup>>;
  workHistory: ApiResult<ListResponse<WorkHistory>>;
  homeConfig: ApiResult<HomeConfig>;
}

/** Envelope every non-2xx response from the backend follows. */
export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
  };
}
