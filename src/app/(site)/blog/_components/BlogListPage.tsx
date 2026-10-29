"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import SectionState from "@/components/common/SectionState";
import { cn } from "@/lib/cn";
import { formatPostDate } from "@/lib/format";
import { stripHtmlToText } from "@/lib/strip-html";
import type { BlogPost } from "@/types/api.types";

interface BlogListPageProps {
  posts: BlogPost[];
  error: string | null;
}

const ALL_TAGS = "all";

const BlogListPage = ({ posts, error }: BlogListPageProps) => {
  const [activeTag, setActiveTag] = useState(ALL_TAGS);

  const tags = Array.from(new Set(posts.flatMap((post) => post.tags.map((tag) => tag.name))));
  const allTags = [ALL_TAGS, ...tags];
  const filtered =
    activeTag === ALL_TAGS
      ? posts
      : posts.filter((post) => post.tags.some((tag) => tag.name === activeTag));

  return (
    <>
      <section className="border-ink border-b-4 px-[clamp(24px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
        <Link
          href="/"
          className="text-ink mb-5 inline-block text-xs font-bold tracking-[1px] uppercase no-underline"
        >
          ← Back Home
        </Link>
        <div className="text-azure mb-3 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[2px] uppercase">
          [ WRITING ]
        </div>
        <h1 className="text-ink mb-5 text-[clamp(44px,8vw,120px)] leading-[0.85] font-black tracking-[-1px] uppercase">
          The Blog
        </h1>
        {allTags.length > 1 && (
          <div
            role="group"
            aria-label="Filter posts by tag"
            className="flex flex-wrap gap-2"
          >
            {allTags.map((tag) => {
              const isActive = tag === activeTag;
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "border-ink cursor-pointer border-2 px-4 py-2 text-xs font-bold tracking-[1px] uppercase",
                    isActive ? "bg-azure text-white" : "bg-paper text-ink",
                  )}
                >
                  {tag === ALL_TAGS ? "All" : tag}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="p-[clamp(24px,5vw,64px)]">
        {error ? (
          <SectionState
            title="Blog unavailable"
            message={error}
          />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-[clamp(14px,2vw,22px)] sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="border-ink flex flex-col border-[3px] bg-white no-underline shadow-[6px_6px_0_#0a0a0a]"
              >
                {post.thumbnailUrl && (
                  <div className="border-ink flex h-[clamp(90px,10vw,130px)] items-center justify-center overflow-hidden border-b-[3px]">
                    <Image
                      src={post.thumbnailUrl}
                      alt=""
                      width={640}
                      height={360}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-[clamp(16px,2vw,22px)]">
                  <div className="mb-3.5 flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="border-ink bg-lime text-ink border-2 px-1.5 py-0.5 text-[clamp(9px,1vw,11px)] font-bold tracking-[1px] uppercase"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-ink mb-2.5 text-[clamp(16px,1.8vw,20px)] leading-[1.25] font-extrabold">
                    {post.title}
                  </h2>
                  <p className="text-ink line-clamp-3 text-sm leading-[1.6]">
                    {stripHtmlToText(post.excerpt)}
                  </p>
                  <div className="border-ink text-ink mt-4 border-t-2 pt-2.5 text-[clamp(10px,1.1vw,12px)] font-bold tracking-[1px] uppercase">
                    {formatPostDate(post.publishedAt)} · {post.timeToReadMinutes} min
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-ink border-[3px] bg-white px-6 py-20 text-center">
            <h2 className="text-ink mb-3 text-xl font-black tracking-[-0.5px] uppercase">
              No posts found
            </h2>
            <p className="text-ink mb-6 text-sm tracking-[0px]">
              {posts.length === 0 ? "No posts have been published yet." : "Try a different tag."}
            </p>
            {posts.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTag(ALL_TAGS)}
                className="border-ink bg-azure cursor-pointer border-[3px] px-6 py-3 text-xs font-bold tracking-[1px] text-white uppercase"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default BlogListPage;
