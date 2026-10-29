import EditProjectPage from "./_components/EditProjectPage";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit project" };

export default function EditProjectRoute() {
  return <EditProjectPage />;
}
