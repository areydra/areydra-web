import Image from "next/image";

import MarkdownPreview from "@/components/markdown/MarkdownPreview";
import { cn } from "@/lib/cn";
import { formatProjectDate } from "@/lib/format";
import { safeExternalUrl } from "@/lib/safe-url";
import type { Project } from "@/types/api.types";

interface ProjectPageProps {
  project: Project;
}

interface ProjectLink {
  label: string;
  href: string;
  primary: boolean;
}

const buildLinks = (project: Project): ProjectLink[] => {
  const candidates: Array<{ label: string; href: string | null; primary: boolean }> = [
    { label: "Live", href: safeExternalUrl(project.liveUrl), primary: true },
    { label: "GitHub", href: safeExternalUrl(project.githubUrl), primary: false },
    { label: "App Store", href: safeExternalUrl(project.appStoreUrl), primary: false },
    { label: "Play Store", href: safeExternalUrl(project.playStoreUrl), primary: false },
  ];

  return candidates.flatMap(({ label, href, primary }) => (href ? [{ label, href, primary }] : []));
};

const ProjectPage = ({ project }: ProjectPageProps) => {
  const links = buildLinks(project);
  const images = [...project.images].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <section className="border-ink bg-azure border-b-4 px-[clamp(24px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
        {project.role && (
          <div className="text-lime mb-4 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
            {project.role}
          </div>
        )}
        <h1 className="text-lime mb-6 text-[clamp(30px,6vw,80px)] leading-[0.95] font-black tracking-[-1px] uppercase">
          {project.title}
        </h1>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech.id}
              className="border-ink bg-paper text-ink border-2 px-2.5 py-1 text-[11px] font-bold tracking-[1px] uppercase"
            >
              {tech.name}
            </span>
          ))}
        </div>
        {project.projectDate && (
          <p className="text-lime text-[13px] font-bold tracking-[1px] uppercase">
            {formatProjectDate(project.projectDate)}
          </p>
        )}
        {links.length > 0 && (
          <div className="border-ink mt-6 flex w-fit flex-wrap border-[3px]">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "px-5 py-3 text-[13px] font-bold tracking-[1px] uppercase no-underline",
                  link.primary ? "bg-ink text-white" : "bg-paper text-ink",
                  index > 0 && "border-ink border-l-[3px]",
                )}
              >
                {link.label} -&gt;
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-4xl p-[clamp(28px,5vw,64px)]">
        {images.length > 0 && (
          <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
            {images.map((image) => (
              <div
                key={image.id}
                className="border-ink aspect-[4/3] overflow-hidden border-[3px] shadow-[5px_5px_0_var(--color-ink-deep)]"
              >
                <Image
                  src={image.imageUrl}
                  alt=""
                  width={480}
                  height={360}
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="block h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Same renderer as the panel's editor. */}
        <MarkdownPreview
          markdown={project.description}
          className="text-ink text-[clamp(14px,1.5vw,17px)] leading-[1.8] font-medium"
        />
      </section>
    </>
  );
};

export default ProjectPage;
