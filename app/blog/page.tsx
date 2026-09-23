import { getBlogPosts } from "@/lib/portfolio-api";
import { BlogListClient } from "./BlogListClient";

export default async function Blog() {
  const { data, error } = await getBlogPosts();
  return <BlogListClient posts={data?.items ?? []} error={error} />;
}
