import type { Metadata } from "next";

import ProjectsPage from "./_components/ProjectsPage";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsRoute() {
  return <ProjectsPage />;
}
