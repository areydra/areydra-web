import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBlogPostBySlug } from "@/services/portfolio-service";

import BlogPostPage from "./_components/BlogPostPage";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await getBlogPostBySlug(slug);

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
    },
  };
}

export default async function BlogPostRoute({ params }: RouteProps) {
  const { slug } = await params;
  const { data: post, error } = await getBlogPostBySlug(slug);

  // A transport failure is not a 404: let the error boundary render it.
  if (error) throw new Error(error);
  if (!post) notFound();

  return <BlogPostPage post={post} />;
}
