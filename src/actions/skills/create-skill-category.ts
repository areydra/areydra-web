"use server";

import { revalidatePath } from "next/cache";

import { actionFailed, type ActionResult } from "@/lib/action-result";
import { adminApi } from "@/services/admin-api.server";

/** Includes the created id so the caller can patch its list without a refetch. */
interface CreatedSkillCategory {
  id: string;
  name: string;
}

export async function createSkillCategoryAction(
  name: string,
): Promise<ActionResult<CreatedSkillCategory>> {
  let created: CreatedSkillCategory;
  try {
    created = await adminApi<CreatedSkillCategory>("/admin/skill-categories", {
      method: "POST",
      body: { name },
    });
  } catch (error) {
    return actionFailed(error);
  }

  revalidatePath("/majourney/skills");
  revalidatePath("/");
  return { ok: true, data: created };
}
