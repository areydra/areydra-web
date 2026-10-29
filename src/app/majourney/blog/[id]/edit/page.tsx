import EditBlogPostPage from "./_components/EditBlogPostPage";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit post" };

export default function EditBlogPostRoute() {
  return <EditBlogPostPage />;
}
