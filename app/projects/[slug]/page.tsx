import { notFound } from "next/navigation";
import { StatusStrip } from "@/components/StatusStrip";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
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
    <div className="bg-[#ebe7d9] min-h-screen">
      <StatusStrip />
      <Nav variant="detail" />

      <section className="px-[clamp(24px,5vw,64px)] py-[clamp(28px,5vw,56px)] border-b-4 border-[#111] bg-[#1410ff]">
        {project.role && (
          <div className="text-[clamp(10px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-[#c8ff00] mb-4">
            {project.role}
          </div>
        )}
        <h1 className="text-[clamp(30px,6vw,80px)] leading-[0.95] uppercase text-[#c8ff00] mb-6 tracking-[-1px] font-black">
          {project.title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => (
            <span
              key={tech.id}
              className="text-[11px] font-bold uppercase tracking-[1px] text-[#111] bg-[#ebe7d9] border-2 border-[#111] px-2.5 py-1"
            >
              {tech.name}
            </span>
          ))}
        </div>
        {project.projectDate && (
          <div className="text-[13px] font-bold uppercase tracking-[1px] text-[#c8ff00]">
            {formatProjectDate(project.projectDate)}
          </div>
        )}
        {links.length > 0 && (
          <div className="flex flex-wrap border-[3px] border-[#111] w-fit mt-6">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-[13px] font-bold uppercase tracking-[1px] px-5 py-3 no-underline ${link.primary ? "text-white bg-[#111]" : "text-[#111] bg-[#ebe7d9]"} ${index > 0 ? "border-l-[3px] border-[#111]" : ""}`}
              >
                {link.label} -&gt;
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="p-[clamp(28px,5vw,64px)] max-w-4xl mx-auto">
        {sortedImages.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5 mb-8">
            {sortedImages.map((img) => (
              <div key={img.id} className="border-[3px] border-[#111] shadow-[5px_5px_0_#0a0a0a] overflow-hidden aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element -- rendering an arbitrary uploaded gallery image URL */}
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover block" />
              </div>
            ))}
          </div>
        )}

        <div
          className="rich-text-content text-[clamp(14px,1.5vw,17px)] font-medium leading-[1.8] text-[#111]"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
        />
      </section>

      <Footer subpage />
    </div>
  );
}
