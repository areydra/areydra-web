import NewBlogPostPage from "./_components/NewBlogPostPage";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "New post" };

export default function NewBlogPostRoute() {
  return <NewBlogPostPage />;
}
