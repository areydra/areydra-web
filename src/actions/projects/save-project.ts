"use server";

import { revalidatePath } from "next/cache";

import { actionFailed, type ActionResult } from "@/lib/action-result";
import { adminApi } from "@/services/admin-api.server";
import type { ProjectInput } from "@/types/admin.types";
import type { Project } from "@/types/api.types";

interface SaveProjectInput {
  id?: string;
  values: ProjectInput;
}

export async function saveProjectAction({
  id,
  values,
}: SaveProjectInput): Promise<ActionResult<Project>> {
  let saved: Project;
  try {
    saved = id
      ? await adminApi<Project>(`/admin/projects/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: values,
        })
      : await adminApi<Project>("/admin/projects", { method: "POST", body: values });
  } catch (error) {
    return actionFailed(error);
  }

  revalidatePath("/majourney/projects");
  revalidatePath("/");
  // The detail page renders this record; its slug comes back from the API.
  revalidatePath(`/projects/${saved.slug}`);
  return { ok: true, data: saved };
}
