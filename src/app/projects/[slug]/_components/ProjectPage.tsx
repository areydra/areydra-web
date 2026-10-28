import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import StatusStrip from "@/components/layout/StatusStrip";
import { cn } from "@/lib/cn";
import { formatProjectDate } from "@/lib/format";
import { safeExternalUrl } from "@/lib/safe-url";
import { sanitizeHtml } from "@/lib/sanitize-html";
import type { Project } from "@/types/api.types";

type ProjectPageProps = {
  project: Project;
};

type ProjectLink = {
  label: string;
  href: string;
  primary: boolean;
};

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
    <div className="min-h-screen bg-paper">
      <StatusStrip />
      <Nav variant="detail" />

      <main id="main-content">
      <section className="border-b-4 border-ink bg-azure px-[clamp(24px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
        {project.role && (
          <div className="mb-4 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] text-lime uppercase">
            {project.role}
          </div>
        )}
        <h1 className="mb-6 text-[clamp(30px,6vw,80px)] leading-[0.95] font-black tracking-[-1px] text-lime uppercase">
          {project.title}
        </h1>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech.id}
              className="border-2 border-ink bg-paper px-2.5 py-1 text-[11px] font-bold tracking-[1px] text-ink uppercase"
            >
              {tech.name}
            </span>
          ))}
        </div>
        {project.projectDate && (
          <p className="text-[13px] font-bold tracking-[1px] text-lime uppercase">
            {formatProjectDate(project.projectDate)}
          </p>
        )}
        {links.length > 0 && (
          <div className="mt-6 flex w-fit flex-wrap border-[3px] border-ink">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "px-5 py-3 text-[13px] font-bold tracking-[1px] uppercase no-underline",
                  link.primary ? "bg-ink text-white" : "bg-paper text-ink",
                  index > 0 && "border-l-[3px] border-ink",
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
                className="aspect-[4/3] overflow-hidden border-[3px] border-ink shadow-[5px_5px_0_#0a0a0a]"
              >
                {/* Arbitrary upload URL: the host is not known at build time. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.imageUrl}
                  alt=""
                  width={480}
                  height={360}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div
          className="rich-text-content text-[clamp(14px,1.5vw,17px)] leading-[1.8] font-medium text-ink"
          // Editor output, sanitized server-side against an allowlist.
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
        />
      </section>
      </main>

      <Footer subpage />
    </div>
  );
};

export default ProjectPage;
