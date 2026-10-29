"use server";

import { revalidatePath } from "next/cache";

import { actionFailed, type ActionResult } from "@/lib/action-result";
import { adminApi } from "@/services/admin-api.server";

export async function deleteSkillAction(skillId: string): Promise<ActionResult<null>> {
  try {
    await adminApi<null>(`/admin/skills/${encodeURIComponent(skillId)}`, { method: "DELETE" });
  } catch (error) {
    return actionFailed(error);
  }

  revalidatePath("/majourney/skills");
  revalidatePath("/");
  return { ok: true, data: null };
}
