import { NextResponse, type NextRequest } from "next/server";

/**
 * Nonce-based CSP rollout.
 *
 * Next injects the nonce from the request's `Content-Security-Policy` header
 * into its own script tags, so the policy below is a working candidate. It is
 * sent as `Content-Security-Policy-Report-Only`: the enforced policy still
 * lives in `next.config.mjs` until this one reports clean, per the convention's
 * "report-only first" rule. `strict-dynamic` is deliberately omitted so the
 * reports describe real inline scripts rather than downstream trust chains.
 */
export function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const isDevelopment = process.env.NODE_ENV !== "production";

  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy-Report-Only", policy);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
