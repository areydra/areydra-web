import { SITE_URL } from "@/constants/site";
import { getBlogPosts, getProjects } from "@/services/portfolio-service.server";

import type { MetadataRoute } from "next";

/**
 * Generated sitemap (never a static file in `public/`, so it stays correct as
 * routes come and go). API failures are not fatal: the static routes still ship.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const [posts, projects] = await Promise.all([getBlogPosts(), getProjects()]);

  const postEntries: MetadataRoute.Sitemap = (posts.data?.items ?? []).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const projectEntries: MetadataRoute.Sitemap = (projects.data?.items ?? []).map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries, ...projectEntries];
}
