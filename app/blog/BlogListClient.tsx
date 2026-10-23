"use client";

import { useState } from "react";
import { StatusStrip } from "@/components/StatusStrip";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SectionState } from "@/components/home/SectionState";
import { formatPostDate } from "@/components/home/formatters";
import { pickBlogPalette } from "@/lib/blog-display";
import type { BlogPost } from "@/lib/portfolio-api";
import { MarkdownPreview } from "@/components/MarkdownPreview";

type BlogListClientProps = {
  posts: BlogPost[];
  error: string | null;
};

const baseTagClass = "text-xs font-bold uppercase tracking-[1px] border-2 border-[#111] px-4 py-2 cursor-pointer";

export function BlogListClient({ posts, error }: BlogListClientProps) {
  const [activeTag, setActiveTag] = useState("all");

  const allTags = ["all", ...Array.from(new Set(posts.flatMap((p) => p.tags.map((t) => t.name))))] as string[];
  const filtered = activeTag === "all" ? posts : posts.filter((p) => p.tags.some((t) => t.name === activeTag));

  return (
    <div className="bg-[#ebe7d9] min-h-screen">
      <StatusStrip />
      <Nav variant="subpage" />

      <section className="px-[clamp(24px,5vw,64px)] py-[clamp(28px,5vw,56px)] border-b-4 border-[#111]">
        <a href="/" className="text-xs font-bold uppercase tracking-[1px] text-[#111] no-underline inline-block mb-5">
          ← Back Home
        </a>
        <div className="text-[clamp(10px,1.2vw,13px)] font-bold uppercase tracking-[2px] text-[#1410ff] mb-3">
          [ WRITING ]
        </div>
        <h1 className="text-[clamp(44px,8vw,120px)] leading-[0.85] uppercase text-[#111] mb-5 tracking-[-1px] font-black">
          The Blog
        </h1>
        {allTags.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`${baseTagClass} ${tag === activeTag ? "text-white bg-[#1410ff]" : "text-[#111] bg-[#ebe7d9]"}`}
              >
                {tag === "all" ? "All" : tag}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="p-[clamp(24px,5vw,64px)]">
        {error ? (
          <SectionState title="Blog unavailable" message={error} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(14px,2vw,22px)]">
            {filtered.map((post) => {
              const palette = pickBlogPalette(post.id);
              return (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#0a0a0a] flex flex-col no-underline"
                >
                  {post.thumbnailUrl && (
                    <div className="h-[clamp(90px,10vw,130px)] border-b-[3px] border-[#111] flex items-center justify-center overflow-hidden">
                      <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-[clamp(16px,2vw,22px)] flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1 mb-3.5">
                      {post.tags.map((t) => (
                        <span
                          key={t.id}
                          className="text-[clamp(9px,1vw,11px)] font-bold uppercase tracking-[1px] text-[#111] bg-[#c8ff00] border-2 border-[#111] px-1.5 py-0.5"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-[clamp(16px,1.8vw,20px)] font-extrabold text-[#111] mb-2.5 leading-[1.25]">
                      {post.title}
                    </h2>
                    <MarkdownPreview markdown={post.excerpt} />
                    <div className="text-[clamp(10px,1.1vw,12px)] font-bold uppercase tracking-[1px] text-[#111] border-t-2 border-[#111] mt-4 pt-2.5">
                      {formatPostDate(post.publishedAt)} · {post.timeToReadMinutes} min
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 px-6 border-[3px] border-[#111] bg-white">
            <h3 className="text-xl uppercase tracking-[-0.5px] text-[#111] mb-3 font-black">No posts found</h3>
            <p className="text-sm tracking-[0px] text-[#111] mb-6">
              {posts.length === 0 ? "No posts have been published yet." : "Try a different tag."}
            </p>
            {posts.length > 0 && (
              <button
                onClick={() => setActiveTag("all")}
                className="text-xs font-bold uppercase tracking-[1px] text-white bg-[#1410ff] border-[3px] border-[#111] px-6 py-3 cursor-pointer"
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
