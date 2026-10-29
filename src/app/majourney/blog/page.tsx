import BlogPostsPage from "./_components/BlogPostsPage";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPostsRoute() {
  return <BlogPostsPage />;
}
