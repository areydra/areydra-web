"use server";

import { revalidatePath } from "next/cache";

/**
 * Cache invalidation after a browser-side admin mutation.
 *
 * Mutations now go straight from the browser to api.areydra.com with the
 * host-only session cookie. That request never reaches a Next Server Action,
 * so the paths the mutation affects have to be invalidated separately. This
 * action does only that: no cookie read, no API call, no authority of its own.
 * The scope is a closed set so a caller cannot invalidate an arbitrary path.
 */
export async function revalidatePublicPathsAction(
  scope: "blog" | "project" | "profile" | "skills" | "work-history" | "home-config",
  slug?: string,
): Promise<void> {
  switch (scope) {
    case "blog":
      revalidatePath("/majourney/blog");
      revalidatePath("/blog");
      revalidatePath("/");
      if (slug) revalidatePath(`/blog/${slug}`);
      break;
    case "project":
      revalidatePath("/majourney/projects");
      revalidatePath("/");
      if (slug) revalidatePath(`/projects/${slug}`);
      break;
    case "profile":
      revalidatePath("/majourney/profile");
      revalidatePath("/");
      break;
    case "skills":
      revalidatePath("/majourney/skills");
      revalidatePath("/");
      break;
    case "work-history":
      revalidatePath("/majourney/work-history");
      revalidatePath("/");
      break;
    case "home-config":
      revalidatePath("/majourney/home-config");
      revalidatePath("/");
      break;
  }
}
