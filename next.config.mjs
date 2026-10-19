// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['jsdom', 'isomorphic-dompurify', '@exodus/bytes'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://assets.areydra.com https://*.r2.cloudflarestorage.com https://*.cloudflarestorage.com",
              "font-src 'self' https://fonts.gstatic.com",
              "media-src 'self' https://assets.areydra.com https://*.r2.cloudflarestorage.com",
              "connect-src 'self' https://api.areydra.com https://*.r2.cloudflarestorage.com https://*.cloudflarestorage.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ]
      }
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.areydra.com' },
    ],
  },
};

export default nextConfig;