import Link from "next/link";

import SectionState from "@/components/common/SectionState";
import { stripHtmlToText } from "@/lib/strip-html";
import type { Project } from "@/types/api.types";

type ProjectsSectionProps = {
  projects: Project[] | null;
  error: string | null;
};

const MAX_TECH_CHIPS = 6;

const ProjectsSection = ({ projects, error }: ProjectsSectionProps) => {
  const items = projects ?? [];

  return (
    <section id="projects" className="border-b-4 border-ink bg-azure p-[clamp(24px,5vw,64px)]">
      <div className="mb-[clamp(24px,4vw,40px)] flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] text-lime uppercase">
            [ 04 ] Portfolio
          </div>
          <h2 className="font-anton m-0 text-[clamp(28px,4.5vw,68px)] leading-[0.92] tracking-[-0.5px] text-paper uppercase">
            Featured Projects
          </h2>
        </div>
      </div>
      {error ? (
        <SectionState tone="dark" title="Projects unavailable" message={error} />
      ) : items.length > 0 ? (
        <div className="home-project-grid">
          {items.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="flex flex-col border-[3px] border-ink bg-paper shadow-[6px_6px_0_#0a0a0a]"
            >
              <div className="font-anton flex h-[clamp(100px,12vw,150px)] items-center justify-center border-b-[3px] border-ink bg-lime py-1 text-[clamp(36px,6vw,60px)] tracking-[-2px] text-ink">
                {project.thumbnailUrl ? (
                  // Arbitrary upload URL: next/image needs every host allowlisted.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.thumbnailUrl}
                    alt=""
                    width={480}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span>{project.title.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-[clamp(16px,2vw,22px)]">
                <h3 className="mb-2 text-[clamp(16px,1.8vw,21px)] font-black text-ink uppercase">
                  {project.title}
                </h3>
                <p className="mb-3.5 line-clamp-3 flex-1 text-[clamp(12px,1.2vw,14px)] leading-[1.6] font-medium text-ink">
                  {stripHtmlToText(project.description)}
                </p>
                <ProjectTechStack techStack={project.techStack} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <SectionState tone="dark" title="No projects" message="No featured projects have been published yet." />
      )}
    </section>
  );
};

type ProjectTechStackProps = {
  techStack: Project["techStack"];
};

const ProjectTechStack = ({ techStack }: ProjectTechStackProps) => {
  // Keep the chips to two rows inside the three-column card grid.
  const hasMore = techStack.length > MAX_TECH_CHIPS;
  const visible = techStack.slice(0, hasMore ? MAX_TECH_CHIPS - 1 : MAX_TECH_CHIPS);
  const hiddenCount = techStack.length - visible.length;

  return (
    <div className="mb-3.5 flex flex-wrap gap-2">
      {visible.map((tech) => (
        <span
          key={tech.id}
          className="border-2 border-ink px-1.5 py-0.5 text-[clamp(9px,1vw,11px)] font-bold tracking-[1px] whitespace-nowrap text-ink uppercase"
        >
          {tech.name}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="border-2 border-ink bg-ink px-1.5 py-0.5 text-[clamp(9px,1vw,11px)] font-bold tracking-[1px] whitespace-nowrap text-paper uppercase">
          +{hiddenCount} more
        </span>
      )}
    </div>
  );
};

export default ProjectsSection;
