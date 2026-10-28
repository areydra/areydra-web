import type { Metadata } from "next";

import NewBlogPostPage from "./_components/NewBlogPostPage";

export const metadata: Metadata = { title: "New post" };

export default function NewBlogPostRoute() {
  return <NewBlogPostPage />;
}
