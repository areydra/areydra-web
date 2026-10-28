import type { Metadata } from "next";

import EditProjectPage from "./_components/EditProjectPage";

export const metadata: Metadata = { title: "Edit project" };

export default function EditProjectRoute() {
  return <EditProjectPage />;
}
