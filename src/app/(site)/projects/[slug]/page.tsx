import { notFound } from "next/navigation";

import { stripHtmlToText } from "@/lib/strip-html";
import { getProjectBySlug } from "@/services/portfolio-service.server";

import ProjectPage from "./_components/ProjectPage";

import type { Metadata } from "next";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await getProjectBySlug(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: stripHtmlToText(project.description).slice(0, 160),
    openGraph: {
      title: project.title,
      description: stripHtmlToText(project.description).slice(0, 160),
      type: "article",
    },
  };
}

export default async function ProjectRoute({ params }: RouteProps) {
  const { slug } = await params;
  const { data: project, error } = await getProjectBySlug(slug);

  // A transport failure is not a 404: let the error boundary render it.
  if (error) throw new Error(error);
  if (!project) notFound();

  return <ProjectPage project={project} />;
}
