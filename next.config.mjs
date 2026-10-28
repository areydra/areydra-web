// next.config.mjs

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const isProduction = process.env.NODE_ENV === "production";

const connectSrc = [
  "'self'",
  "https://*.r2.cloudflarestorage.com",
  "https://*.cloudflarestorage.com",
  ...(apiBaseUrl ? [apiBaseUrl.replace(/\/$/, "")] : []),
];

/**
 * Enforced policy. `unsafe-eval` is limited to development (Next's HMR needs it
 * and production does not). The nonce-based policy that removes `unsafe-inline`
 * is rolled out in report-only mode from `src/middleware.ts` first, because
 * inline style attributes are still emitted by the editor libraries.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://assets.areydra.com https://*.r2.cloudflarestorage.com https://*.cloudflarestorage.com",
  "font-src 'self' https://fonts.gstatic.com",
  "media-src 'self' https://assets.areydra.com https://*.r2.cloudflarestorage.com",
  `connect-src ${connectSrc.join(" ")}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
  ...(isProduction
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "assets.areydra.com" }],
  },
};

export default nextConfig;
