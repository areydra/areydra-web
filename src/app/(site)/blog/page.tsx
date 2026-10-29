import { getBlogPosts } from "@/services/portfolio-service.server";

import BlogListPage from "./_components/BlogListPage";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on software engineering, product work, and the stack behind this site.",
};

export default async function BlogRoute() {
  const { data, error } = await getBlogPosts();

  return (
    <BlogListPage
      posts={data?.items ?? []}
      error={error}
    />
  );
}
