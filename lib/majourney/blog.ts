import type { BlogPost } from "@/lib/api-types";
import type { BlogPostInput } from "./inputs";

export const EMPTY_FORM: BlogPostInput = {
  title: "",
  content: "",
  category: null,
  tagNames: [],
  thumbnailUrl: null,
  status: "draft",
};

export function toForm(item: BlogPost): BlogPostInput {
  return {
    title: item.title,
    content: item.content,
    category: item.category,
    tagNames: item.tags.map((t) => t.name),
    thumbnailUrl: item.thumbnailUrl,
    status: item.status,
  };
}

/** Splits a comma-separated tags text input into a clean list of tag names. */
export function splitList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
