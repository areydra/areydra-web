import { SITE_URL } from "@/constants/site";

import type { MetadataRoute } from "next";

/** The admin panel is private: no crawling, and it is not in the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/majourney", "/majourney/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
