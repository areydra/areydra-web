"use server";

import { revalidatePath } from "next/cache";

import { actionFailed, type ActionResult } from "@/lib/action-result";
import { adminApi } from "@/services/admin-api.server";

interface DeleteProjectInput {
  id: string;
  /** Known by the caller when it has the row; keeps the detail page fresh. */
  slug?: string;
}

export async function deleteProjectAction({
  id,
  slug,
}: DeleteProjectInput): Promise<ActionResult<null>> {
  try {
    await adminApi<null>(`/admin/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch (error) {
    return actionFailed(error);
  }

  revalidatePath("/majourney/projects");
  revalidatePath("/");
  if (slug) revalidatePath(`/projects/${slug}`);
  return { ok: true, data: null };
}
