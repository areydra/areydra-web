import NewProjectPage from "./_components/NewProjectPage";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "New project" };

export default function NewProjectRoute() {
  return <NewProjectPage />;
}
