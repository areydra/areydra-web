"use server";

import { revalidatePath } from "next/cache";

import { actionFailed, type ActionResult } from "@/lib/action-result";
import { adminApi } from "@/services/admin-api.server";
import type { ProfileInput } from "@/types/admin.types";
import type { Profile } from "@/types/api.types";

/** Saves the profile singleton. The API re-authorizes from the forwarded session. */
export async function updateProfileAction(payload: ProfileInput): Promise<ActionResult<Profile>> {
  let profile: Profile;
  try {
    profile = await adminApi<Profile>("/admin/profile", { method: "PUT", body: payload });
  } catch (error) {
    return actionFailed(error);
  }

  revalidatePath("/majourney/profile");
  revalidatePath("/");
  return { ok: true, data: profile };
}
