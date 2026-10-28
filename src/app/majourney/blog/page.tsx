import type { Metadata } from "next";

import BlogPostsPage from "./_components/BlogPostsPage";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPostsRoute() {
  return <BlogPostsPage />;
}
