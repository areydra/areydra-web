import type { BlogPost } from "@/lib/portfolio-api";
import { formatPostDate } from "./formatters";
import { SectionState } from "./SectionState";

type BlogPreviewSectionProps = {
  posts: BlogPost[] | null;
  error: string | null;
};

export function BlogPreviewSection({ posts, error }: BlogPreviewSectionProps) {
  const items = posts ?? [];

  return (
    <section id="blog" className="p-[clamp(24px,5vw,64px)] border-b-4 border-[#111]">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-[clamp(24px,4vw,40px)]">
        <div>
          <div className="text-[clamp(10px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-[#1410ff] mb-3">
            [ 05 ] Writing
          </div>
          <h2 className="font-anton text-[clamp(28px,4.5vw,68px)] leading-[0.92] uppercase text-[#111] m-0 tracking-[-0.5px]">
            From The Blog
          </h2>
        </div>
        <a className="home-outline-link" href="/blog">
          All Posts -&gt;
        </a>
      </div>
      {error ? (
        <SectionState title="Blog unavailable" message={error} />
      ) : items.length > 0 ? (
        <div className="border-[3px] border-[#111]">
          {items.map((post, index) => (
            <a className="home-blog-row" key={post.id} href={`/blog/${post.slug}`}>
              <div className="font-anton text-[clamp(24px,3vw,32px)] text-[#1410ff] leading-[0.9] [webkit-text-stroke:1.5px_#111] min-w-[40px] shrink-0">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[clamp(15px,1.8vw,22px)] font-extrabold text-[#111] mb-2 leading-[1.2]">
                  {post.title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-[clamp(9px,1vw,11px)] font-bold uppercase tracking-[1px] text-[#111] bg-[#c8ff00] border-2 border-[#111] px-2 py-0.5"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-[clamp(10px,1vw,12px)] font-bold uppercase tracking-[1px] text-[#111] whitespace-nowrap text-right shrink-0">
                {formatPostDate(post.publishedAt)}
                <br />
                <span className="opacity-60">{post.timeToReadMinutes} min</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <SectionState title="No posts" message="No featured blog posts have not been published yet." />
      )}
    </section>
  );
}
