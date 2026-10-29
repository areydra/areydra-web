import ProjectsPage from "./_components/ProjectsPage";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsRoute() {
  return <ProjectsPage />;
}
