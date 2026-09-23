import { notFound } from "next/navigation";
import { StatusStrip } from "@/components/StatusStrip";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { mono, anton, archivo } from "@/components/fonts";
import { sanitizeHtml } from "@/lib/majourney/html";
import { getProjectBySlug } from "@/lib/portfolio-api";

function formatProjectDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en", { month: "short", year: "numeric" });
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: project } = await getProjectBySlug(slug);
  if (!project) notFound();

  const links = [
    project.liveUrl ? { label: "Live", href: project.liveUrl, primary: true } : null,
    project.githubUrl ? { label: "GitHub", href: project.githubUrl, primary: false } : null,
    project.appStoreUrl ? { label: "App Store", href: project.appStoreUrl, primary: false } : null,
    project.playStoreUrl ? { label: "Play Store", href: project.playStoreUrl, primary: false } : null,
  ].filter(Boolean) as { label: string; href: string; primary: boolean }[];

  const sortedImages = project.images.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ background: "#ebe7d9", minHeight: "100vh" }}>
      <StatusStrip />

      <Nav variant="detail" />

      {/* PROJECT HEADER */}
      <section style={{ padding: "clamp(28px,5vw,56px) clamp(24px,5vw,64px)", borderBottom: "4px solid #111", background: "#1410ff" }}>
        {project.role && (
          <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#c8ff00", marginBottom: 16 }}>
            {project.role}
          </div>
        )}
        <h1 style={{ ...anton, fontSize: "clamp(30px,6vw,80px)", lineHeight: "0.95", textTransform: "uppercase", color: "#c8ff00", margin: "0 0 22px", letterSpacing: -1 }}>
          {project.title}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {project.techStack.map((tech) => (
            <span key={tech.id} style={{ ...mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#ebe7d9", border: "2px solid #111", padding: "4px 10px" }}>
              {tech.name}
            </span>
          ))}
        </div>
        {project.projectDate && (
          <div style={{ ...mono, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#c8ff00" }}>
            {formatProjectDate(project.projectDate)}
          </div>
        )}
        {links.length > 0 && (
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap", border: "3px solid #111", width: "fit-content", marginTop: 22 }}>
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  ...mono,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: link.primary ? "#fff" : "#111",
                  background: link.primary ? "#111" : "#ebe7d9",
                  padding: "12px 22px",
                  textDecoration: "none",
                  borderLeft: index > 0 ? "3px solid #111" : undefined,
                }}
              >
                {link.label} -&gt;
              </a>
            ))}
          </div>
        )}
      </section>

      {/* PROJECT BODY */}
      <section style={{ padding: "clamp(28px,5vw,64px)", maxWidth: 820, margin: "0 auto" }}>
        {sortedImages.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14, marginBottom: 32 }}>
            {sortedImages.map((img) => (
              <div key={img.id} style={{ border: "3px solid #111", boxShadow: "5px 5px 0 #0a0a0a", overflow: "hidden", aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- rendering an arbitrary uploaded gallery image URL */}
                <img src={img.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>
        )}

        <div
          className="rich-text-content"
          style={{ ...archivo, fontSize: "clamp(14px,1.5vw,17px)", fontWeight: 500, lineHeight: 1.8, color: "#111" }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
        />
      </section>

      <Footer subpage />
    </div>
  );
}
