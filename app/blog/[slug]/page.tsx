import { notFound } from "next/navigation";
import { StatusStrip } from "@/components/StatusStrip";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { mono, anton, archivo } from "@/components/fonts";
import { formatPostDate } from "@/components/home/formatters";
import { sanitizeHtml } from "@/lib/majourney/html";
import { getBlogPostBySlug } from "@/lib/portfolio-api";

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div style={{ background: "#ebe7d9", minHeight: "100vh" }}>
      <StatusStrip />

      <Nav variant="detail" />

      {/* ARTICLE HEADER */}
      <section style={{ padding: "clamp(28px,5vw,56px) clamp(24px,5vw,64px)", borderBottom: "4px solid #111", background: "#1410ff" }}>
        <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#c8ff00", marginBottom: 16 }}>
          {post.category ?? "ARTICLE"}
        </div>
        <h1 style={{ ...anton, fontSize: "clamp(30px,6vw,80px)", lineHeight: "0.95", textTransform: "uppercase", color: "#c8ff00", margin: "0 0 22px", letterSpacing: -1 }}>
          {post.title}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {post.tags.map((t) => (
            <span key={t.id} style={{ ...mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#ebe7d9", border: "2px solid #111", padding: "4px 10px" }}>
              {t.name}
            </span>
          ))}
        </div>
        <div style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#c8ff00" }}>
          {formatPostDate(post.publishedAt)} · {post.timeToReadMinutes} min · By Areydra
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section style={{ padding: "clamp(28px,5vw,64px)", maxWidth: 820, margin: "0 auto" }}>
        {post.thumbnailUrl && (
          <div style={{ border: "3px solid #111", boxShadow: "7px 7px 0 #0a0a0a", marginBottom: 32, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- rendering an arbitrary uploaded/attached URL */}
            <img src={post.thumbnailUrl} alt="" style={{ width: "100%", display: "block" }} />
          </div>
        )}
        <div
          className="rich-text-content"
          style={{ ...archivo, fontSize: "clamp(14px,1.5vw,17px)", fontWeight: 500, lineHeight: 1.8, color: "#111" }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />

        <div style={{ border: "3px solid #111", background: "#c8ff00", boxShadow: "8px 8px 0 #111", padding: "clamp(20px,3vw,32px)", marginTop: 40 }}>
          <div style={{ ...anton, fontSize: 24, textTransform: "uppercase", color: "#111", marginBottom: 10 }}>Enjoyed this?</div>
          <p style={{ ...archivo, fontSize: 14, fontWeight: 600, color: "#111", margin: "0 0 18px" }}>
            Read more on the blog, or reach out — always happy to talk shop.
          </p>
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap", border: "3px solid #111", width: "fit-content" }}>
            <a href="/blog" style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#fff", background: "#1410ff", padding: "12px 22px", textDecoration: "none" }}>
              More Posts
            </a>
            <a
              href="mailto:areydra@gmail.com"
              style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#ebe7d9", padding: "12px 22px", textDecoration: "none", borderLeft: "3px solid #111" }}
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
