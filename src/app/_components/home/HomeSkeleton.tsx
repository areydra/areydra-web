import StatusStrip from "@/components/layout/StatusStrip";
import NavSkeleton from "@/components/layout/NavSkeleton";
import { SkeletonBlock, SkeletonRegion, SkeletonText } from "@/components/ui/Skeleton";

const HOME_SECTIONS_LABEL = "Loading the page";

const STAT_SLOTS = ["Years Exp.", "Roles Held", "Companies", "Skills"];
const PROJECT_SLOTS = 3;
const SKILL_SLOTS = 3;
const WORK_SLOTS = 3;
const BLOG_SLOTS = 3;

/**
 * Stands in for the whole homepage. `/` fetches every section in one await, so
 * the fallback has to reserve all of them — the swap happens once, and any
 * section missing here would push the content down when it lands.
 *
 * Every wrapper class below is copied from the section it mirrors (including
 * the `home-*` classes in globals.css), and every text block carries the real
 * typography token with transparent ink, so heights match at all widths.
 */
const HomeSkeleton = () => {
  return (
    <div className="bg-paper min-h-screen">
      <StatusStrip />
      <NavSkeleton variant="home" />

      <main id="main-content">
        <SkeletonRegion label={HOME_SECTIONS_LABEL}>
          <HeroSkeleton />
          <MarqueeSkeleton />
          <StatsSkeleton />
          <AboutSkeleton />
          <SkillsSkeleton />
          <WorkHistorySkeleton />
          <ProjectsSkeleton />
          <BlogPreviewSkeleton />
          <ContactSkeleton />
        </SkeletonRegion>
      </main>
    </div>
  );
};

const HeroSkeleton = () => (
  <section className="home-hero">
    <div className="home-hero__content">
      <div className="border-ink bg-lime mb-[clamp(18px,3vw,26px)] inline-block border-[3px] px-3 py-1.5 text-[clamp(10px,1.3vw,13px)] font-bold tracking-[1px] uppercase">
        <SkeletonText as="span">Software Engineer</SkeletonText>
      </div>
      <h1 className="font-anton m-0 text-[clamp(52px,11vw,168px)] leading-[0.82] tracking-[-1px] uppercase">
        <SkeletonText
          as="span"
          className="block"
        >
          Hi,
        </SkeletonText>
        <SkeletonText
          as="span"
          className="block"
        >
          I&apos;m
        </SkeletonText>
        <SkeletonText
          as="span"
          className="block"
        >
          Areydra
        </SkeletonText>
      </h1>
      {/* Two lines of one wrapped paragraph: no gap between them, exactly like
          the real <p>. A gap here double-counts the line box and makes the
          whole page 4px taller than the content it is reserving. */}
      <div className="mt-[clamp(18px,3vw,30px)] flex max-w-[56ch] flex-col text-[clamp(14px,1.6vw,20px)] leading-[1.55] font-medium">
        <SkeletonText as="div">Lorem ipsum dolor sit amet, consectetur adipiscing</SkeletonText>
        <SkeletonText
          as="div"
          className="w-11/12"
        >
          elit sed do eiusmod tempor incididunt
        </SkeletonText>
        <SkeletonText
          as="div"
          className="w-11/12"
        >
          elit sed do
        </SkeletonText>
      </div>
      <div className="home-action-row">
        <div className="home-action-row__primary">
          <SkeletonText as="span">View Projects -&gt;</SkeletonText>
        </div>
        <div className="home-action-row__secondary">
          <SkeletonText as="span">Get in Touch</SkeletonText>
        </div>
      </div>
    </div>

    <div className="home-hero__side">
      <div className="home-hero__mark">
        <SkeletonBlock className="h-full w-full" />
      </div>
      <div className="home-hero__mini-stats">
        {["Years Exp.", "Companies"].map((label, index) => (
          <div
            key={label}
            className={
              index === 0
                ? "border-ink border-r-[3px] p-[clamp(16px,2vw,22px)]"
                : "p-[clamp(16px,2vw,22px)]"
            }
          >
            <div className="font-anton text-[clamp(36px,4.5vw,54px)] leading-[0.9]">
              <SkeletonText as="div">12+</SkeletonText>
            </div>
            <div className="mt-1 text-[clamp(10px,1vw,12px)] font-bold tracking-[1px] uppercase">
              <SkeletonText as="span">{label}</SkeletonText>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const MarqueeSkeleton = () => (
  <div className="border-ink bg-lime overflow-hidden border-b-4 py-[clamp(10px,1.5vw,14px)]">
    <div className="font-anton inline-flex text-[clamp(18px,3vw,30px)] tracking-[1px] whitespace-nowrap uppercase">
      <SkeletonText as="span">
        TypeScript * React * Next.js * Tailwind * Node.js * Postgres *
      </SkeletonText>
    </div>
  </div>
);

const StatsSkeleton = () => (
  <div className="border-ink bg-ink grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-[1px] border-b-4">
    {STAT_SLOTS.map((label) => (
      <div
        key={label}
        className="bg-paper px-[clamp(14px,3vw,40px)] py-[clamp(20px,3vw,34px)]"
      >
        <div className="font-anton text-[clamp(36px,5vw,72px)] leading-[0.9]">
          <SkeletonText as="div">12+</SkeletonText>
        </div>
        <div className="mt-2 text-[clamp(10px,1vw,12px)] font-bold tracking-[1px] uppercase">
          <SkeletonText as="span">{label}</SkeletonText>
        </div>
      </div>
    ))}
  </div>
);

const AboutSkeleton = () => (
  <section className="home-about">
    <div className="home-about__copy">
      <div className="mb-3.5 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
        <SkeletonText as="span">[ 01 ] About Me</SkeletonText>
      </div>
      <h2 className="font-anton mb-[clamp(16px,2.5vw,26px)] text-[clamp(28px,4.5vw,68px)] leading-[0.92] tracking-[-0.5px] uppercase">
        <SkeletonText as="span">About Me</SkeletonText>
      </h2>
      {/* One wrapped paragraph, so the lines are separated by the line box only. */}
      <div className="flex flex-col text-[clamp(14px,1.5vw,16px)] leading-[1.7] font-medium">
        <SkeletonText as="div">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </SkeletonText>
        <SkeletonText
          as="div"
          className="w-11/12"
        >
          sed do eiusmod tempor incididunt ut labore et dolore
        </SkeletonText>
        <SkeletonText
          as="div"
          className="w-9/12"
        >
          magna aliqua ut enim ad minim veniam
        </SkeletonText>
      </div>
    </div>

    <div className="home-about__cards">
      {[0, 1, 2, 3].map((slot) => (
        <div
          key={slot}
          className="bg-paper p-[clamp(16px,2.5vw,28px)]"
        >
          <div className="font-anton text-[clamp(22px,3vw,30px)] leading-none">
            <SkeletonText as="div">{String(slot + 1).padStart(2, "0")}</SkeletonText>
          </div>
          <div className="mt-2.5 mb-1.5 text-[clamp(13px,1.4vw,17px)] font-extrabold uppercase">
            <SkeletonText as="div">Placeholder title</SkeletonText>
          </div>
          <div className="text-[clamp(12px,1.2vw,14px)] leading-[1.55] font-medium">
            <SkeletonText as="div">Lorem ipsum dolor sit amet</SkeletonText>
            <SkeletonText
              as="div"
              className="w-3/4"
            >
              consectetur adipiscing
            </SkeletonText>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const SkillsSkeleton = () => (
  <section className="border-ink border-b-4 p-[clamp(24px,5vw,64px)]">
    <div className="mb-3 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
      <SkeletonText as="span">[ 02 ] Technical Skills</SkeletonText>
    </div>
    <h2 className="font-anton mb-[clamp(24px,4vw,40px)] text-[clamp(28px,4.5vw,68px)] leading-[0.92] tracking-[-0.5px] uppercase">
      <SkeletonText as="span">The Stack</SkeletonText>
    </h2>
    <div className="home-skill-grid">
      {Array.from({ length: SKILL_SLOTS }).map((_, group) => (
        <div
          key={group}
          className="bg-paper p-[clamp(16px,2.5vw,28px)]"
        >
          <div className="mb-3.5 text-[clamp(10px,1vw,12px)] font-bold tracking-[1.5px] uppercase">
            <SkeletonText as="span">Category</SkeletonText>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["TypeScript", "React", "Next.js", "Node.js", "Postgres"].map((skill) => (
              <div
                key={skill}
                className="border-ink border-2 px-2.5 py-1 text-[clamp(11px,1.1vw,13px)] font-bold tracking-[1px] uppercase"
              >
                <SkeletonText as="span">{skill}</SkeletonText>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const WorkHistorySkeleton = () => (
  <section className="border-ink border-b-4">
    <div className="px-[clamp(24px,5vw,64px)] pt-[clamp(24px,5vw,64px)]">
      <div className="mb-3 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
        <SkeletonText as="span">[ 03 ] Work History</SkeletonText>
      </div>
      <h2 className="font-anton mb-[clamp(24px,4vw,40px)] text-[clamp(28px,4.5vw,68px)] leading-[0.92] tracking-[-0.5px] uppercase">
        <SkeletonText as="span">Where I&apos;ve Worked</SkeletonText>
      </h2>
    </div>
    {Array.from({ length: WORK_SLOTS }).map((_, index) => (
      <div
        key={index}
        className="border-ink flex items-start gap-[clamp(14px,3vw,40px)] border-t-[3px] px-[clamp(24px,5vw,64px)] py-[clamp(20px,3vw,40px)]"
      >
        <div className="font-anton min-w-[clamp(60px,8vw,110px)] shrink-0 text-[clamp(32px,5vw,80px)] leading-[0.8]">
          <SkeletonText as="div">{String(index + 1).padStart(2, "0")}</SkeletonText>
        </div>
        <div className="min-w-0 flex-1">
          <div className="home-work-heading">
            <h3 className="m-0 text-[clamp(17px,2.2vw,30px)] font-black uppercase">
              <SkeletonText as="span">Placeholder role</SkeletonText>
            </h3>
            <div className="home-work-period">
              <SkeletonText as="span">Jan 2020 – Present</SkeletonText>
            </div>
          </div>
          <div className="text-[clamp(13px,1.4vw,15px)] font-bold tracking-[1px]">
            <SkeletonText as="span">Placeholder company</SkeletonText>
          </div>
          <div className="mt-3 flex flex-col text-[clamp(13px,1.3vw,15px)] leading-[1.6] font-medium">
            <SkeletonText as="div">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </SkeletonText>
            <SkeletonText
              as="div"
              className="w-11/12"
            >
              sed do eiusmod tempor incididunt ut labore et dolore
            </SkeletonText>
            <SkeletonText
              as="div"
              className="w-10/12"
            >
              magna aliqua ut enim ad minim veniam
            </SkeletonText>
          </div>
        </div>
      </div>
    ))}
  </section>
);

const ProjectsSkeleton = () => (
  <section className="border-ink bg-azure border-b-4 p-[clamp(24px,5vw,64px)]">
    <div className="mb-[clamp(24px,4vw,40px)] flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-3 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
          <SkeletonText as="span">[ 04 ] Portfolio</SkeletonText>
        </div>
        <h2 className="font-anton m-0 text-[clamp(28px,4.5vw,68px)] leading-[0.92] tracking-[-0.5px] uppercase">
          <SkeletonText as="span">Featured Projects</SkeletonText>
        </h2>
      </div>
    </div>
    <div className="home-project-grid">
      {Array.from({ length: PROJECT_SLOTS }).map((_, index) => (
        <div
          key={index}
          className="border-ink bg-paper flex flex-col border-[3px] shadow-[6px_6px_0_#0a0a0a]"
        >
          <SkeletonBlock className="border-ink h-[clamp(100px,12vw,150px)] border-b-[3px]" />
          <div className="flex flex-1 flex-col p-[clamp(16px,2vw,22px)]">
            <h3 className="mb-2 text-[clamp(16px,1.8vw,21px)] font-black uppercase">
              <SkeletonText as="span">Placeholder project</SkeletonText>
            </h3>
            <div className="mb-3.5 flex flex-col gap-1 text-[clamp(12px,1.2vw,14px)] leading-[1.6] font-medium">
              <SkeletonText as="div">Lorem ipsum dolor sit amet</SkeletonText>
              <SkeletonText
                as="div"
                className="w-11/12"
              >
                consectetur adipiscing elit sed
              </SkeletonText>
              <SkeletonText
                as="div"
                className="w-3/4"
              >
                do eiusmod tempor
              </SkeletonText>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Tailwind"].map((tech) => (
                <div
                  key={tech}
                  className="border-ink border-2 px-1.5 py-0.5 text-[clamp(9px,1vw,11px)] font-bold tracking-[1px] whitespace-nowrap uppercase"
                >
                  <SkeletonText as="span">{tech}</SkeletonText>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const BlogPreviewSkeleton = () => (
  <section className="border-ink border-b-4 p-[clamp(24px,5vw,64px)]">
    <div className="mb-[clamp(24px,4vw,40px)] flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-3 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
          <SkeletonText as="span">[ 05 ] Writing</SkeletonText>
        </div>
        <h2 className="font-anton m-0 text-[clamp(28px,4.5vw,68px)] leading-[0.92] tracking-[-0.5px] uppercase">
          <SkeletonText as="span">From The Blog</SkeletonText>
        </h2>
      </div>
      <div className="home-outline-link">
        <SkeletonText as="span">All Posts -&gt;</SkeletonText>
      </div>
    </div>
    <div className="border-ink border-[3px]">
      {Array.from({ length: BLOG_SLOTS }).map((_, index) => (
        <div
          key={index}
          className="home-blog-row"
        >
          <div className="font-anton min-w-[40px] shrink-0 text-[clamp(24px,3vw,32px)] leading-[0.9]">
            <SkeletonText as="div">{String(index + 1).padStart(2, "0")}</SkeletonText>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-2 text-[clamp(15px,1.8vw,22px)] leading-[1.2] font-extrabold">
              <SkeletonText as="span">A placeholder post title</SkeletonText>
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Engineering", "Notes"].map((tag) => (
                <div
                  key={tag}
                  className="border-ink border-2 px-2 py-0.5 text-[clamp(9px,1vw,11px)] font-bold tracking-[1px] uppercase"
                >
                  <SkeletonText as="span">{tag}</SkeletonText>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0 text-right text-[clamp(10px,1vw,12px)] font-bold tracking-[1px] whitespace-nowrap uppercase">
            <SkeletonText as="div">Jan 01, 2026</SkeletonText>
            <SkeletonText as="div">5 min</SkeletonText>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const ContactSkeleton = () => (
  <section className="border-ink bg-lime border-b-4 px-[clamp(24px,5vw,64px)] py-[clamp(36px,7vw,96px)]">
    <div className="mb-4 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
      <SkeletonText as="span">[ 06 ] Get In Touch</SkeletonText>
    </div>
    <h2 className="font-anton mb-[clamp(24px,4vw,36px)] text-[clamp(44px,9vw,150px)] leading-[0.82] tracking-[-1px] uppercase">
      <SkeletonText
        as="span"
        className="block"
      >
        Let&apos;s Build
      </SkeletonText>
      <SkeletonText
        as="span"
        className="block"
      >
        Something.
      </SkeletonText>
    </h2>
    <div className="home-contact-actions">
      <div className="home-contact-actions__primary">
        <SkeletonText as="span">hello@example.com</SkeletonText>
      </div>
      <div className="home-contact-actions__secondary">
        <SkeletonText as="span">LinkedIn</SkeletonText>
      </div>
    </div>
  </section>
);

export default HomeSkeleton;
