"use server";

import { revalidatePath } from "next/cache";

import { actionFailed, type ActionResult } from "@/lib/action-result";
import { adminApi } from "@/services/admin-api.server";

interface DeleteBlogPostInput {
  id: string;
  slug?: string;
}

export async function deleteBlogPostAction({
  id,
  slug,
}: DeleteBlogPostInput): Promise<ActionResult<null>> {
  try {
    await adminApi<null>(`/admin/blog/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch (error) {
    return actionFailed(error);
  }

  revalidatePath("/majourney/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) revalidatePath(`/blog/${slug}`);
  return { ok: true, data: null };
}
