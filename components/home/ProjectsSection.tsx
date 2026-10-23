import type { Project } from "@/lib/portfolio-api";
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
    <section id="projects" className="p-[clamp(24px,5vw,64px)] border-b-4 border-[#111] bg-[#1410ff]">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-[clamp(24px,4vw,40px)]">
        <div>
          <div className="text-[clamp(10px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-[#c8ff00] mb-3">[ 04 ] Portfolio</div>
          <h2 className="font-anton text-[clamp(28px,4.5vw,68px)] leading-[0.92] uppercase text-[#ebe7d9] m-0 tracking-[-0.5px]">
            Featured Projects
          </h2>
        </div>
      </div>
      {error ? (
        <SectionState tone="dark" title="Projects unavailable" message={error} />
      ) : items.length > 0 ? (
        <div className="home-project-grid">
          {items.map((project) => (
            <div key={project.id} className="bg-[#ebe7d9] border-[3px] border-[#111] shadow-[6px_6px_0_#0a0a0a] flex flex-col">
              <div className="font-anton h-[clamp(100px,12vw,150px)] bg-[#c8ff00] border-b-[3px] border-[#111] flex items-center justify-center text-[clamp(36px,6vw,60px)] text-[#111] tracking-[-2px]">
                {initials(project.title)}
              </div>
              <div className="p-[clamp(16px,2vw,22px)] flex flex-col flex-1">
                <h3 className="text-[clamp(16px,1.8vw,21px)] font-black uppercase text-[#111] mb-2">
                  <a href={`/projects/${project.slug}`} className="text-inherit no-underline block">
                    {project.title}
                  </a>
                </h3>
                <p className="text-[clamp(12px,1.2vw,14px)] font-medium leading-[1.6] text-[#111] mb-3.5 flex-1 line-clamp-3">
                  {stripHtmlToText(project.description)}
                </p>
                <div className="flex flex-wrap gap-2 mb-3.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech.id}
                      className="text-[clamp(9px,1vw,11px)] font-bold uppercase tracking-[1px] text-[#111] border-2 border-[#111] px-1.5 py-0.5"
                    >
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
    <div className="flex border-[3px] border-[#111]">
      {links.slice(0, 2).map((link, index) => (
        <a
          key={link.href}
          href={link.href}
          className={`flex-1 text-center text-[clamp(10px,1.1vw,12px)] font-bold uppercase tracking-[1px] p-[clamp(8px,1vw,10px)] no-underline ${link.primary ? "text-white bg-[#1410ff]" : "text-[#111] bg-[#ebe7d9]"} ${index > 0 ? "border-l-[3px] border-[#111]" : ""}`}
        >
          {link.label} -&gt;
        </a>
      ))}
    </div>
  );
}
