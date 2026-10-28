import type { Metadata } from "next";

import NewProjectPage from "./_components/NewProjectPage";

export const metadata: Metadata = { title: "New project" };

export default function NewProjectRoute() {
  return <NewProjectPage />;
}
