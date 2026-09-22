import type { BlogStatus, WorkStatus } from "@/lib/api-types";

/** Editable payload for `PUT /api/admin/profile`. */
export type ProfileInput = {
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
};

/** Editable payload for the work-history create/update endpoints. */
export type WorkHistoryInput = {
  company: string;
  role: string;
  status: WorkStatus;
  description: string;
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
  companyLogoUrl: string | null;
};

/** Editable payload for the project create/update endpoints. */
export type ProjectInput = {
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
};

/** Editable payload for the blog create/update endpoints. */
export type BlogPostInput = {
  title: string;
  content: string;
  category: string | null;
  tagNames: string[];
  thumbnailUrl: string | null;
  status: BlogStatus;
};

/** Settings payload for `PUT /api/admin/home-config`. */
export type HomeConfigInput = {
  totalShowProjects: number;
  totalShowBlogs: number;
};
