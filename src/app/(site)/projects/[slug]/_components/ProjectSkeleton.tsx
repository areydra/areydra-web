import { SkeletonBlock, SkeletonRegion, SkeletonText } from "@/components/ui/Skeleton";

const GALLERY_SLOTS = 3;
const TECH_SLOTS = ["Next.js", "TypeScript", "Tailwind"];

/**
 * Stands in for `ProjectPage` while `/projects/[slug]` loads. Mirrors the azure
 * hero (role, title, tech chips, date, link row) and the 4xl body column
 * (gallery grid, then description).
 */
const ProjectSkeleton = () => {
  return (
    <>
      <SkeletonRegion label="Loading the project">
        <section className="border-ink bg-azure border-b-4 px-[clamp(24px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
          <div className="mb-4 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
            <SkeletonText as="span">Role</SkeletonText>
          </div>
          <h1 className="mb-6 text-[clamp(30px,6vw,80px)] leading-[0.95] font-black tracking-[-1px] uppercase">
            <SkeletonText as="span">A placeholder project title</SkeletonText>
          </h1>
          <div className="mb-4 flex flex-wrap gap-2">
            {TECH_SLOTS.map((tech) => (
              <div
                key={tech}
                className="border-ink bg-paper border-2 px-2.5 py-1 text-[11px] font-bold tracking-[1px] uppercase"
              >
                <SkeletonText as="span">{tech}</SkeletonText>
              </div>
            ))}
          </div>
          <p className="text-[13px] font-bold tracking-[1px] uppercase">
            <SkeletonText as="span">Jan 2026</SkeletonText>
          </p>
          <div className="border-ink mt-6 flex w-fit flex-wrap border-[3px]">
            <div className="bg-ink px-5 py-3 text-[13px] font-bold tracking-[1px] uppercase">
              <SkeletonText as="span">Live</SkeletonText>
            </div>
            <div className="border-ink bg-paper border-l-[3px] px-5 py-3 text-[13px] font-bold tracking-[1px] uppercase">
              <SkeletonText as="span">GitHub</SkeletonText>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl p-[clamp(28px,5vw,64px)]">
          <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
            {Array.from({ length: GALLERY_SLOTS }).map((_, index) => (
              <SkeletonBlock
                key={index}
                className="border-ink aspect-[4/3] border-[3px] shadow-[5px_5px_0_#0a0a0a]"
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 text-[clamp(14px,1.5vw,17px)] leading-[1.8] font-medium">
            <SkeletonText as="div">Lorem ipsum dolor sit amet, consectetur adipiscing</SkeletonText>
            <SkeletonText
              as="div"
              className="w-11/12"
            >
              elit sed do eiusmod tempor incididunt ut labore
            </SkeletonText>
            <SkeletonText
              as="div"
              className="w-full"
            >
              et dolore magna aliqua ut enim ad minim veniam
            </SkeletonText>
            <SkeletonText
              as="div"
              className="w-10/12"
            >
              quis nostrud exercitation ullamco laboris
            </SkeletonText>
          </div>
        </section>
      </SkeletonRegion>
    </>
  );
};

export default ProjectSkeleton;
