"use server";

import { revalidatePath } from "next/cache";

import { actionFailed, type ActionResult } from "@/lib/action-result";
import { adminApi } from "@/services/admin-api.server";

export async function deleteWorkHistoryAction(id: string): Promise<ActionResult<null>> {
  try {
    await adminApi<null>(`/admin/work-history/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch (error) {
    return actionFailed(error);
  }

  revalidatePath("/majourney/work-history");
  revalidatePath("/");
  return { ok: true, data: null };
}
