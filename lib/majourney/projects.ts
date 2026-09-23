import type { Project } from "@/lib/api-types";
import type { ProjectInput } from "./inputs";

export const EMPTY_FORM: ProjectInput = {
  title: "",
  description: "",
  role: "",
  githubUrl: null,
  liveUrl: null,
  appStoreUrl: null,
  playStoreUrl: null,
  projectDate: null,
  thumbnailUrl: null,
  skillIds: [],
  images: [],
};

export function toForm(item: Project): ProjectInput {
  return {
    title: item.title,
    description: item.description,
    role: item.role,
    githubUrl: item.githubUrl,
    liveUrl: item.liveUrl,
    appStoreUrl: item.appStoreUrl,
    playStoreUrl: item.playStoreUrl,
    projectDate: item.projectDate,
    thumbnailUrl: item.thumbnailUrl,
    skillIds: item.techStack.map((t) => t.id),
    images: item.images.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((img) => ({ imageUrl: img.imageUrl, sortOrder: img.sortOrder })),
  };
}
