import { notFound } from "next/navigation";
import { StatusStrip } from "@/components/StatusStrip";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { formatPostDate } from "@/components/home/formatters";
import { getBlogPostBySlug } from "@/lib/portfolio-api";
import { MarkdownPreview } from "@/components/MarkdownPreview";

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="bg-[#ebe7d9] min-h-screen">
      <StatusStrip />
      <Nav variant="detail" />

      {/* ARTICLE HEADER */}
      <section className="px-[clamp(24px,5vw,64px)] py-[clamp(28px,5vw,56px)] border-b-4 border-[#111] bg-[#1410ff]">
        <div className="text-[clamp(10px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-[#c8ff00] mb-4">
          {post.category ?? "ARTICLE"}
        </div>
        <h1 className="text-[clamp(30px,6vw,80px)] leading-[0.95] uppercase text-[#c8ff00] mb-6 tracking-[-1px] font-black">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((t) => (
            <span key={t.id} className="text-[11px] font-bold uppercase tracking-[1px] text-[#111] bg-[#ebe7d9] border-2 border-[#111] px-2.5 py-1">
              {t.name}
            </span>
          ))}
        </div>
        <div className="text-[13px] font-bold uppercase tracking-[1px] text-[#c8ff00]">
          {formatPostDate(post.publishedAt)} · {post.timeToReadMinutes} min · By Areydra
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section className="px-[clamp(28px,5vw,64px)] py-[clamp(28px,5vw,64px)] max-w-4xl mx-auto">
        {post.thumbnailUrl && (
          <div className="border-[3px] border-[#111] shadow-[7px_7px_0_#0a0a0a] mb-8 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- rendering an arbitrary uploaded/attached URL */}
            <img src={post.thumbnailUrl} alt="" className="w-full block" />
          </div>
        )}
        <MarkdownPreview markdown={post.content} />

        <div className="border-[3px] border-[#111] bg-[#c8ff00] shadow-[8px_8px_0_#111] p-[clamp(20px,3vw,32px)] mt-10">
          <div className="text-2xl uppercase tracking-[-0.5px] text-[#111] mb-2.5 font-black">Enjoyed this?</div>
          <p className="text-sm font-semibold tracking-[0px] text-[#111] mb-4">
            Read more on the blog, or reach out — always happy to talk shop.
          </p>
          <div className="flex flex-wrap border-[3px] border-[#111] w-fit">
            <a href="/blog" className="text-[13px] font-bold uppercase tracking-[1px] text-white bg-[#1410ff] px-5 py-3 no-underline">
              More Posts
            </a>
            <a
              href="mailto:areydra@gmail.com"
              className="text-[13px] font-bold uppercase tracking-[1px] text-[#111] bg-[#ebe7d9] px-5 py-3 no-underline border-l-[3px] border-[#111]"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer subpage />
    </div>
  );
}
