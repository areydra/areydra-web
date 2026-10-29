"use server";

import { revalidatePath } from "next/cache";

import { actionFailed, type ActionResult } from "@/lib/action-result";
import { adminApi } from "@/services/admin-api.server";
import type { HomeConfigInput } from "@/types/admin.types";

interface SavedHomeConfig {
  totalShowProjects: number;
  totalShowBlogs: number;
}

export async function updateHomeConfigAction(
  payload: HomeConfigInput,
): Promise<ActionResult<SavedHomeConfig>> {
  let saved: SavedHomeConfig;
  try {
    saved = await adminApi<SavedHomeConfig>("/admin/home-config", {
      method: "PUT",
      body: payload,
    });
  } catch (error) {
    return actionFailed(error);
  }

  revalidatePath("/majourney/home-config");
  revalidatePath("/");
  return { ok: true, data: saved };
}
