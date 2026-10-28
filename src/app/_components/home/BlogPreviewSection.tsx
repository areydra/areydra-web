import Link from "next/link";

import SectionState from "@/components/common/SectionState";
import { formatPostDate } from "@/lib/format";
import type { BlogPost } from "@/types/api.types";

type BlogPreviewSectionProps = {
  posts: BlogPost[] | null;
  error: string | null;
};

const BlogPreviewSection = ({ posts, error }: BlogPreviewSectionProps) => {
  const items = posts ?? [];

  return (
    <section id="blog" className="border-b-4 border-ink p-[clamp(24px,5vw,64px)]">
      <div className="mb-[clamp(24px,4vw,40px)] flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] text-azure uppercase">
            [ 05 ] Writing
          </div>
          <h2 className="font-anton m-0 text-[clamp(28px,4.5vw,68px)] leading-[0.92] tracking-[-0.5px] text-ink uppercase">
            From The Blog
          </h2>
        </div>
        <Link className="home-outline-link" href="/blog">
          All Posts -&gt;
        </Link>
      </div>
      {error ? (
        <SectionState title="Blog unavailable" message={error} />
      ) : items.length > 0 ? (
        <div className="border-[3px] border-ink">
          {items.map((post, index) => (
            <Link className="home-blog-row" key={post.id} href={`/blog/${post.slug}`}>
              <div className="font-anton min-w-[40px] shrink-0 text-[clamp(24px,3vw,32px)] leading-[0.9] text-azure [webkit-text-stroke:1.5px_#111]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-2 text-[clamp(15px,1.8vw,22px)] leading-[1.2] font-extrabold text-ink">
                  {post.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="border-2 border-ink bg-lime px-2 py-0.5 text-[clamp(9px,1vw,11px)] font-bold tracking-[1px] text-ink uppercase"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-right text-[clamp(10px,1vw,12px)] font-bold tracking-[1px] whitespace-nowrap text-ink uppercase">
                {formatPostDate(post.publishedAt)}
                <br />
                <span className="opacity-60">{post.timeToReadMinutes} min</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <SectionState title="No posts" message="No featured blog posts have been published yet." />
      )}
    </section>
  );
};

export default BlogPreviewSection;
