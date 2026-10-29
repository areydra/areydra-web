import { ApiError } from "@/lib/admin-api-client";

/**
 * Every Server Action returns this instead of throwing. A thrown error crosses
 * the action boundary as an opaque digest in production, so failures have to be
 * values the form can render. `code` is the API's error code, so the caller can
 * tell an expired session from a validation failure.
 */
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string; code: string };

export function actionFailed(error: unknown): ActionResult<never> {
  if (error instanceof ApiError) {
    return { ok: false, error: error.message, code: error.code };
  }
  return { ok: false, error: "Something went wrong. Try again.", code: "ACTION_FAILED" };
}
