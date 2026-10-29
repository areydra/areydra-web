"use server";

import { revalidatePath } from "next/cache";

import { actionFailed, type ActionResult } from "@/lib/action-result";
import { adminApi } from "@/services/admin-api.server";
import type { WorkHistoryInput } from "@/types/admin.types";
import type { WorkHistory } from "@/types/api.types";

interface SaveWorkHistoryInput {
  /** Present on update, absent on create. */
  id?: string;
  values: WorkHistoryInput;
}

export async function saveWorkHistoryAction({
  id,
  values,
}: SaveWorkHistoryInput): Promise<ActionResult<WorkHistory>> {
  let saved: WorkHistory;
  try {
    saved = id
      ? await adminApi<WorkHistory>(`/admin/work-history/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: values,
        })
      : await adminApi<WorkHistory>("/admin/work-history", { method: "POST", body: values });
  } catch (error) {
    return actionFailed(error);
  }

  revalidatePath("/majourney/work-history");
  revalidatePath("/");
  return { ok: true, data: saved };
}
