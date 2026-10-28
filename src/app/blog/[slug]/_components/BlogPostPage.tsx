import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import StatusStrip from "@/components/layout/StatusStrip";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";
import { formatPostDate } from "@/lib/format";
import { toMailtoHref } from "@/lib/safe-url";
import type { BlogPost } from "@/types/api.types";

type BlogPostPageProps = {
  post: BlogPost;
};

const CONTACT_HREF = toMailtoHref("areydra@gmail.com");

const BlogPostPage = ({ post }: BlogPostPageProps) => {
  return (
    <div className="min-h-screen bg-paper">
      <StatusStrip />
      <Nav variant="detail" />

      <main id="main-content">
      <article>
        <header className="border-b-4 border-ink bg-azure px-[clamp(24px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
          <div className="mb-4 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] text-lime uppercase">
            {post.category ?? "ARTICLE"}
          </div>
          <h1 className="mb-6 text-[clamp(30px,6vw,80px)] leading-[0.95] font-black tracking-[-1px] text-lime uppercase">
            {post.title}
          </h1>
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="border-2 border-ink bg-paper px-2.5 py-1 text-[11px] font-bold tracking-[1px] text-ink uppercase"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <p className="text-[13px] font-bold tracking-[1px] text-lime uppercase">
            {formatPostDate(post.publishedAt)} · {post.timeToReadMinutes} min · By Areydra
          </p>
        </header>

        <div className="mx-auto max-w-4xl px-[clamp(28px,5vw,64px)] py-[clamp(28px,5vw,64px)]">
          {post.thumbnailUrl && (
            <div className="mb-8 overflow-hidden border-[3px] border-ink shadow-[7px_7px_0_#0a0a0a]">
              {/* Arbitrary upload URL: the host is not known at build time. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.thumbnailUrl}
                alt=""
                width={1200}
                height={630}
                decoding="async"
                className="block w-full"
              />
            </div>
          )}
          <MarkdownPreview markdown={post.content} />

          <aside className="mt-10 border-[3px] border-ink bg-lime p-[clamp(20px,3vw,32px)] shadow-[8px_8px_0_#111]">
            <h2 className="mb-2.5 text-2xl font-black tracking-[-0.5px] text-ink uppercase">Enjoyed this?</h2>
            <p className="mb-4 text-sm font-semibold tracking-[0px] text-ink">
              Read more on the blog, or reach out — always happy to talk shop.
            </p>
            <div className="flex w-fit flex-wrap border-[3px] border-ink">
              <Link
                href="/blog"
                className="bg-azure px-5 py-3 text-[13px] font-bold tracking-[1px] text-white uppercase no-underline"
              >
                More Posts
              </Link>
              {CONTACT_HREF && (
                <a
                  href={CONTACT_HREF}
                  className="border-l-[3px] border-ink bg-paper px-5 py-3 text-[13px] font-bold tracking-[1px] text-ink uppercase no-underline"
                >
                  Get in Touch
                </a>
              )}
            </div>
          </aside>
        </div>
      </article>
      </main>

      <Footer subpage />
    </div>
  );
};

export default BlogPostPage;
