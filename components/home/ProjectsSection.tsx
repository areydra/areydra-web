import type { Project } from "@/lib/portfolio-api";
import { anton, archivo, mono } from "@/components/fonts";
import { stripHtmlToText } from "@/lib/majourney/html";
import { initials } from "./formatters";
import { SectionState } from "./SectionState";

type ProjectsSectionProps = {
  projects: Project[] | null;
  error: string | null;
};

export function ProjectsSection({ projects, error }: ProjectsSectionProps) {
  const items = projects ?? [];

  return (
    <section id="projects" style={{ padding: "clamp(24px,5vw,64px)", borderBottom: "4px solid #111", background: "#1410ff" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: "clamp(24px,4vw,40px)" }}>
        <div>
          <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#c8ff00", marginBottom: 12 }}>[ 04 ] Portfolio</div>
          <h2 style={{ ...anton, fontSize: "clamp(28px,4.5vw,68px)", lineHeight: "0.92", textTransform: "uppercase", color: "#ebe7d9", margin: 0, letterSpacing: -0.5 }}>Featured Projects</h2>
        </div>
      </div>
      {error ? (
        <SectionState tone="dark" title="Projects unavailable" message={error} />
      ) : items.length > 0 ? (
        <div className="home-project-grid">
          {items.map((project) => (
            <div key={project.id} style={{ background: "#ebe7d9", border: "3px solid #111", boxShadow: "6px 6px 0 #0a0a0a", display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  height: "clamp(100px, 12vw, 150px)",
                  background: "#c8ff00",
                  borderBottom: "3px solid #111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...anton,
                  fontSize: "clamp(36px, 6vw, 60px)",
                  color: "#111",
                  letterSpacing: -2,
                }}
              >
                {initials(project.title)}
              </div>
              <div style={{ padding: "clamp(16px,2vw,22px)", display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ ...archivo, fontSize: "clamp(16px,1.8vw,21px)", fontWeight: 900, textTransform: "uppercase", color: "#111", margin: "0 0 8px" }}>
                  <a href={`/projects/${project.slug}`} style={{ color: "inherit", textDecoration: "none", display: "block" }}>
                    {project.title}
                  </a>
                </h3>
                <p
                  style={{
                    ...archivo,
                    fontSize: "clamp(12px,1.2vw,14px)",
                    fontWeight: 500,
                    lineHeight: 1.6,
                    color: "#111",
                    margin: "0 0 14px",
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {stripHtmlToText(project.description)}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                  {project.techStack.map((tech) => (
                    <span key={tech.id} style={{ ...mono, fontSize: "clamp(9px,1vw,11px)", fontWeight: 700, textTransform: "uppercase", color: "#111", border: "2px solid #111", padding: "3px 7px" }}>
                      {tech.name}
                    </span>
                  ))}
                </div>
                <ProjectLinks project={project} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SectionState tone="dark" title="No projects" message="No featured projects have been published yet." />
      )}
    </section>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  const links = [
    project.liveUrl ? { label: "Live", href: project.liveUrl, primary: true } : null,
    project.githubUrl ? { label: "GitHub", href: project.githubUrl, primary: false } : null,
    project.appStoreUrl ? { label: "App Store", href: project.appStoreUrl, primary: false } : null,
    project.playStoreUrl ? { label: "Play Store", href: project.playStoreUrl, primary: false } : null,
  ].filter(Boolean) as { label: string; href: string; primary: boolean }[];

  if (links.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 0, border: "3px solid #111" }}>
      {links.slice(0, 2).map((link, index) => (
        <a
          key={link.href}
          href={link.href}
          style={{
            flex: 1,
            textAlign: "center",
            ...mono,
            fontSize: "clamp(10px,1.1vw,12px)",
            fontWeight: 700,
            textTransform: "uppercase",
            color: link.primary ? "#fff" : "#111",
            background: link.primary ? "#1410ff" : "#ebe7d9",
            padding: "clamp(8px,1vw,10px)",
            textDecoration: "none",
            borderLeft: index > 0 ? "3px solid #111" : undefined,
          }}
        >
          {link.label} -&gt;
        </a>
      ))}
    </div>
  );
}
