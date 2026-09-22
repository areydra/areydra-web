import type { BlogPost } from "@/lib/portfolio-api";
import { anton, archivo, mono } from "@/components/fonts";
import { formatPostDate } from "./formatters";
import { SectionState } from "./SectionState";

type BlogPreviewSectionProps = {
  posts: BlogPost[] | null;
  error: string | null;
};

export function BlogPreviewSection({ posts, error }: BlogPreviewSectionProps) {
  const items = posts ?? [];

  return (
    <section id="blog" style={{ padding: "clamp(24px,5vw,64px)", borderBottom: "4px solid #111" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: "clamp(24px,4vw,40px)" }}>
        <div>
          <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#1410ff", marginBottom: 12 }}>[ 05 ] Writing</div>
          <h2 style={{ ...anton, fontSize: "clamp(28px,4.5vw,68px)", lineHeight: "0.92", textTransform: "uppercase", color: "#111", margin: 0, letterSpacing: -0.5 }}>From The Blog</h2>
        </div>
        <a className="home-outline-link" href="/blog">
          All Posts -&gt;
        </a>
      </div>
      {error ? (
        <SectionState title="Blog unavailable" message={error} />
      ) : items.length > 0 ? (
        <div style={{ border: "3px solid #111" }}>
          {items.map((post, index) => (
            <a
              className="home-blog-row"
              key={post.id}
              href="/blog"
              style={{
                borderBottom: index < items.length - 1 ? "3px solid #111" : undefined,
              }}
            >
              <div style={{ ...anton, fontSize: "clamp(24px,3vw,32px)", color: "#1410ff", lineHeight: "0.9", WebkitTextStroke: "1.5px #111", minWidth: 50, flexShrink: 0 }}>{String(index + 1).padStart(2, "0")}</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{ ...archivo, fontSize: "clamp(15px,1.8vw,22px)", fontWeight: 800, color: "#111", margin: "0 0 8px", lineHeight: 1.2 }}>{post.title}</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {post.tags.map((tag) => (
                    <span key={tag.id} style={{ ...mono, fontSize: "clamp(9px,1vw,11px)", fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#c8ff00", border: "2px solid #111", padding: "2px 8px" }}>
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ ...mono, fontSize: "clamp(10px,1vw,12px)", fontWeight: 700, textTransform: "uppercase", color: "#111", whiteSpace: "nowrap", textAlign: "right", flexShrink: 0 }}>
                {formatPostDate(post.publishedAt)}
                <br />
                <span style={{ opacity: 0.6 }}>{post.timeToReadMinutes} min</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <SectionState title="No posts" message="No featured blog posts have been published yet." />
      )}
    </section>
  );
}
