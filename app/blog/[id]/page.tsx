import { notFound } from "next/navigation";
import { StatusStrip } from "@/components/StatusStrip";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { mono, anton, archivo } from "@/components/fonts";
import { posts } from "../posts";

export function generateStaticParams() {
  return posts.map((_, i) => ({ id: String(i) }));
}

type Block = { text: string; image?: { caption: string; placeholder: string } };

export default async function BlogDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = parseInt(id, 10);
  const post = posts[index];
  if (!post) notFound();

  // Interleave body paragraphs with one supporting image after the 2nd paragraph.
  const blocks: Block[] = post.body.map((text, i) => ({
    text,
    image: i === 1 ? post.image : undefined,
  }));

  return (
    <div style={{ background: "#ebe7d9", minHeight: "100vh" }}>
      <StatusStrip />

      <Nav variant="detail" />

      {/* ARTICLE HEADER */}
      <section style={{ padding: "clamp(28px,5vw,56px) clamp(24px,5vw,64px)", borderBottom: "4px solid #111", background: post.bg }}>
        <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: post.fg, marginBottom: 16 }}>
          POST № {post.num}
        </div>
        <h1 style={{ ...anton, fontSize: "clamp(30px,6vw,80px)", lineHeight: "0.95", textTransform: "uppercase", color: post.fg, margin: "0 0 22px", letterSpacing: -1 }}>
          {post.title}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {post.tags.map((t) => (
            <span key={t} style={{ ...mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#ebe7d9", border: "2px solid #111", padding: "4px 10px" }}>
              {t}
            </span>
          ))}
        </div>
        <div style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: post.fg }}>
          {post.date} · {post.read} · By Areydra
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section style={{ padding: "clamp(28px,5vw,64px)", maxWidth: 820, margin: "0 auto" }}>
        <p style={{ ...archivo, fontSize: "clamp(16px,1.8vw,20px)", fontWeight: 600, lineHeight: 1.7, color: "#111", margin: "0 0 28px" }}>
          {post.excerpt}
        </p>
        {blocks.map((block, i) => (
          <div key={i}>
            <p style={{ ...archivo, fontSize: "clamp(14px,1.5vw,17px)", fontWeight: 500, lineHeight: 1.8, color: "#111", margin: "0 0 22px" }}>
              {block.text}
            </p>
            {block.image && (
              <figure style={{ margin: "0 0 28px" }}>
                <div
                  style={{
                    border: "3px solid #111",
                    boxShadow: "7px 7px 0 #0a0a0a",
                    overflow: "hidden",
                    aspectRatio: "16/9",
                    background: "#ddd8c8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#111", opacity: 0.45, textAlign: "center", padding: "0 24px" }}>
                    {block.image.placeholder}
                  </span>
                </div>
                <figcaption style={{ ...mono, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#111", opacity: 0.65, marginTop: 10 }}>
                  {block.image.caption}
                </figcaption>
              </figure>
            )}
          </div>
        ))}

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
