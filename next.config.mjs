// next.config.mjs

const isProduction = process.env.NODE_ENV === "production";

/**
 * The Content-Security-Policy is **not** here: it needs a per-request nonce on
 * the request headers so Next.js can stamp its inline bootstrap scripts, and a
 * static header cannot do that. `src/proxy.ts` owns the full policy.
 */
const securityHeaders = [
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
    // Same host set as the enforced CSP `img-src`: a URL outside this list is
    // already blocked by the browser, so next/image can optimise every image
    // that can actually load.
    remotePatterns: [
      { protocol: "https", hostname: "assets.areydra.com" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "**.cloudflarestorage.com" },
    ],
  },
};

export default nextConfig;
