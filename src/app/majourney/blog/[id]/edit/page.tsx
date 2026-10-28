import type { Metadata } from "next";

import EditBlogPostPage from "./_components/EditBlogPostPage";

export const metadata: Metadata = { title: "Edit post" };

export default function EditBlogPostRoute() {
  return <EditBlogPostPage />;
}
