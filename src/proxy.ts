import { NextResponse, type NextRequest } from "next/server";

/**
 * Content-Security-Policy is owned here, not in `next.config.mjs`.
 *
 * The nonce must be generated per request and placed on the *request* headers,
 * because that is where Next.js reads it from to stamp its own inline bootstrap
 * scripts. A policy set only on the response cannot do that.
 *
 * `script-src` carries no `'unsafe-inline'` in production: every inline script
 * Next emits gets the nonce, and anything else is blocked. `style-src` keeps
 * `'unsafe-inline'` because the rich-text editors emit inline style attributes,
 * which nonces cannot cover — a report-only policy without it below surfaces
 * whatever still needs it.
 */
const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

const connectSrc = [
  "'self'",
  "https://*.r2.cloudflarestorage.com",
  "https://*.cloudflarestorage.com",
  ...(apiBaseUrl ? [apiBaseUrl] : []),
].join(" ");

const sharedDirectives = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://assets.areydra.com https://*.r2.cloudflarestorage.com https://*.cloudflarestorage.com",
  "font-src 'self' https://fonts.gstatic.com",
  "media-src 'self' https://assets.areydra.com https://*.r2.cloudflarestorage.com",
  `connect-src ${connectSrc}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
];

const buildPolicy = (
  nonce: string,
  scriptSrc: string[],
  styleSrc: string[],
  extra: string[] = [],
) =>
  [
    ...sharedDirectives,
    ...extra,
    `script-src ${scriptSrc.join(" ")}`,
    `style-src ${styleSrc.join(" ")}`,
  ].join("; ");

export function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const isDevelopment = process.env.NODE_ENV !== "production";

  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "https://va.vercel-scripts.com",
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
  ];

  // `upgrade-insecure-requests` is enforced-only: browsers ignore it in a
  // report-only policy and log a warning for it.
  const policy = buildPolicy(
    nonce,
    scriptSrc,
    ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    ["upgrade-insecure-requests"],
  );

  // Same policy minus inline styles: report-only, so tightening style-src is a
  // later flip backed by reports instead of a guess.
  const styleTightening = buildPolicy(nonce, scriptSrc, ["'self'", "https://fonts.googleapis.com"]);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", policy);
  response.headers.set("Content-Security-Policy-Report-Only", styleTightening);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
