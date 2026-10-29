import Image from "next/image";
import Link from "next/link";

import { formatPostDate } from "@/lib/format";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { toMailtoHref } from "@/lib/safe-url";
import type { BlogPost } from "@/types/api.types";

interface BlogPostPageProps {
  post: BlogPost;
}

const CONTACT_HREF = toMailtoHref("areydra@gmail.com");

const BlogPostPage = ({ post }: BlogPostPageProps) => {
  return (
    <>
      <article>
        <header className="border-ink bg-azure border-b-4 px-[clamp(24px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
          <div className="text-lime mb-4 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
            {post.category ?? "ARTICLE"}
          </div>
          <h1 className="text-lime mb-6 text-[clamp(30px,6vw,80px)] leading-[0.95] font-black tracking-[-1px] uppercase">
            {post.title}
          </h1>
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="border-ink bg-paper text-ink border-2 px-2.5 py-1 text-[11px] font-bold tracking-[1px] uppercase"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <p className="text-lime text-[13px] font-bold tracking-[1px] uppercase">
            {formatPostDate(post.publishedAt)} · {post.timeToReadMinutes} min · By Areydra
          </p>
        </header>

        <div className="mx-auto max-w-4xl px-[clamp(28px,5vw,64px)] py-[clamp(28px,5vw,64px)]">
          {post.thumbnailUrl && (
            <div className="border-ink mb-8 overflow-hidden border-[3px] shadow-[7px_7px_0_var(--color-ink-deep)]">
              {/* LCP on this route is the h1 above (text), so no preload hint: an
                  image preload would compete with the real candidate. */}
              <Image
                src={post.thumbnailUrl}
                alt=""
                width={1200}
                height={630}
                sizes="(min-width: 1024px) 896px, 100vw"
                className="block w-full"
              />
            </div>
          )}
          <div
            className="rich-text-content text-ink text-[clamp(15px,1.6vw,17px)] leading-[1.8] font-medium"
            // Editor output, sanitized server-side against an allowlist. Rendering it
            // on the server keeps the article out of the client bundle and stops the
            // client-only preview from expanding the page after hydration (0.25 CLS).
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />

          <aside className="border-ink bg-lime mt-10 border-[3px] p-[clamp(20px,3vw,32px)] shadow-[8px_8px_0_var(--color-ink)]">
            <h2 className="text-ink mb-2.5 text-2xl font-black tracking-[-0.5px] uppercase">
              Enjoyed this?
            </h2>
            <p className="text-ink mb-4 text-sm font-semibold tracking-[0px]">
              Read more on the blog, or reach out — always happy to talk shop.
            </p>
            <div className="border-ink flex w-fit flex-wrap border-[3px]">
              <Link
                href="/blog"
                className="bg-azure px-5 py-3 text-[13px] font-bold tracking-[1px] text-white uppercase no-underline"
              >
                More Posts
              </Link>
              {CONTACT_HREF && (
                <a
                  href={CONTACT_HREF}
                  className="border-ink bg-paper text-ink border-l-[3px] px-5 py-3 text-[13px] font-bold tracking-[1px] uppercase no-underline"
                >
                  Get in Touch
                </a>
              )}
            </div>
          </aside>
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;
