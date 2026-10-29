"use server";

import { revalidatePath } from "next/cache";

import { actionFailed, type ActionResult } from "@/lib/action-result";
import { adminApi } from "@/services/admin-api.server";
import type { BlogPostInput } from "@/types/admin.types";
import type { BlogPost } from "@/types/api.types";

interface SaveBlogPostInput {
  id?: string;
  values: BlogPostInput;
}

export async function saveBlogPostAction({
  id,
  values,
}: SaveBlogPostInput): Promise<ActionResult<BlogPost>> {
  let saved: BlogPost;
  try {
    if (id) {
      saved = await adminApi<BlogPost>(`/admin/blog/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: values,
      });
    } else {
      // Create defaults to draft server-side; status is not accepted until update.
      const { status: _status, ...createPayload } = values;
      saved = await adminApi<BlogPost>("/admin/blog", { method: "POST", body: createPayload });
    }
  } catch (error) {
    return actionFailed(error);
  }

  revalidatePath("/majourney/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath(`/blog/${saved.slug}`);
  return { ok: true, data: saved };
}
