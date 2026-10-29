"use server";

import { revalidatePath } from "next/cache";

import { actionFailed, type ActionResult } from "@/lib/action-result";
import { adminApi } from "@/services/admin-api.server";

interface CreatedSkill {
  id: string;
  name: string;
  categoryId: string;
}

export async function createSkillAction(
  categoryId: string,
  name: string,
): Promise<ActionResult<CreatedSkill>> {
  let skill: CreatedSkill;
  try {
    skill = await adminApi<CreatedSkill>("/admin/skills", {
      method: "POST",
      body: { categoryId, name },
    });
  } catch (error) {
    return actionFailed(error);
  }

  revalidatePath("/majourney/skills");
  revalidatePath("/");
  return { ok: true, data: skill };
}
