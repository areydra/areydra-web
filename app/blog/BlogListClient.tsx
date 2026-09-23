"use client";

import { useState } from "react";
import { useWindowWidth } from "@/components/useWindowWidth";
import { StatusStrip } from "@/components/StatusStrip";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SectionState } from "@/components/home/SectionState";
import { mono, anton, archivo } from "@/components/fonts";
import { formatPostDate, initials } from "@/components/home/formatters";
import { pickBlogPalette } from "@/lib/blog-display";
import type { BlogPost } from "@/lib/portfolio-api";

const activeTagStyle = { ...mono, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, color: "#fff", background: "#1410ff", border: "2px solid #111", padding: "8px 16px", cursor: "pointer" };
const inactiveTagStyle = { ...mono, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, color: "#111", background: "#ebe7d9", border: "2px solid #111", padding: "8px 16px", cursor: "pointer" };

type BlogListClientProps = {
  posts: BlogPost[];
  error: string | null;
};

export function BlogListClient({ posts, error }: BlogListClientProps) {
  const [activeTag, setActiveTag] = useState("all");
  const width = useWindowWidth();

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  const gridCols = isDesktop ? "repeat(3,1fr)" : isTablet ? "repeat(2,1fr)" : "repeat(1,1fr)";
  const allTags = ["all", ...Array.from(new Set(posts.flatMap((p) => p.tags.map((t) => t.name))))];
  const filtered = activeTag === "all" ? posts : posts.filter((p) => p.tags.some((t) => t.name === activeTag));

  return (
    <div style={{ background: "#ebe7d9", minHeight: "100vh" }}>
      <StatusStrip />

      <Nav variant="subpage" isMobile={isMobile} />

      {/* PAGE HEADER */}
      <section style={{ padding: "clamp(28px,5vw,56px) clamp(24px,5vw,64px)", borderBottom: "4px solid #111" }}>
        <a href="/" style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#111", textDecoration: "none", display: "inline-block", marginBottom: 20 }}>
          ← Back Home
        </a>
        <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#1410ff", marginBottom: 12 }}>[ WRITING ]</div>
        <h1 style={{ ...anton, fontSize: "clamp(44px,8vw,120px)", lineHeight: "0.85", textTransform: "uppercase", color: "#111", margin: "0 0 20px", letterSpacing: -1 }}>The Blog</h1>
        <p style={{ ...archivo, fontSize: "clamp(14px,1.6vw,18px)", fontWeight: 500, lineHeight: 1.6, color: "#111", maxWidth: 560, margin: "0 0 28px" }}>
          Notes on React Native, backend systems, and lessons from shipping mobile products at scale.
        </p>
        {allTags.length > 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {allTags.map((tag) => (
              <button key={tag} onClick={() => setActiveTag(tag)} style={tag === activeTag ? activeTagStyle : inactiveTagStyle}>
                {tag === "all" ? "All" : tag}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* POSTS GRID */}
      <section style={{ padding: "clamp(24px,5vw,64px)" }}>
        {error ? (
          <SectionState title="Blog unavailable" message={error} />
        ) : filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: "clamp(14px,2vw,22px)" }}>
            {filtered.map((post) => {
              const palette = pickBlogPalette(post.id);
              return (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  style={{ background: "#fff", border: "3px solid #111", boxShadow: "6px 6px 0 #0a0a0a", display: "flex", flexDirection: "column", textDecoration: "none" }}
                >
                  <div
                    style={{
                      height: "clamp(90px,10vw,130px)",
                      background: post.thumbnailUrl ? undefined : palette.bg,
                      borderBottom: "3px solid #111",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      ...(!post.thumbnailUrl && {
                        ...anton,
                        fontSize: "clamp(32px,5vw,52px)",
                        color: palette.fg,
                        letterSpacing: -2,
                        WebkitTextStroke: "1.5px #111",
                      }),
                    }}
                  >
                    {post.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- rendering an arbitrary uploaded/attached URL
                      <img src={post.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      initials(post.title)
                    )}
                  </div>
                  <div style={{ padding: "clamp(16px,2vw,22px)", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                      {post.tags.map((t) => (
                        <span key={t.id} style={{ ...mono, fontSize: "clamp(9px,1vw,11px)", fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#c8ff00", border: "2px solid #111", padding: "3px 7px" }}>
                          {t.name}
                        </span>
                      ))}
                    </div>
                    <h2 style={{ ...archivo, fontSize: "clamp(16px,1.8vw,20px)", fontWeight: 800, color: "#111", margin: "0 0 10px", lineHeight: 1.25 }}>{post.title}</h2>
                    <p style={{ ...archivo, fontSize: "clamp(12px,1.2vw,14px)", fontWeight: 500, lineHeight: 1.6, color: "#111", margin: 0, flex: 1 }}>{post.excerpt}</p>
                    <div style={{ ...mono, fontSize: "clamp(10px,1.1vw,12px)", fontWeight: 700, textTransform: "uppercase", color: "#111", borderTop: "2px solid #111", marginTop: 16, paddingTop: 10 }}>
                      {formatPostDate(post.publishedAt)} · {post.timeToReadMinutes} min
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 24px", border: "3px solid #111", background: "#fff" }}>
            <h3 style={{ ...anton, fontSize: 32, textTransform: "uppercase", color: "#111", margin: "0 0 12px" }}>No posts found</h3>
            <p style={{ ...archivo, fontSize: 15, color: "#111", margin: "0 0 24px" }}>
              {posts.length === 0 ? "No posts have been published yet." : "Try a different tag."}
            </p>
            {posts.length > 0 && (
              <button
                onClick={() => setActiveTag("all")}
                style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#fff", background: "#1410ff", border: "3px solid #111", padding: "12px 24px", cursor: "pointer" }}
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </section>

      <Footer subpage />
    </div>
  );
}
