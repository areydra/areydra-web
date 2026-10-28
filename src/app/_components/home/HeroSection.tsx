import { formatCount } from "@/lib/format";
import type { Profile } from "@/types/api.types";

type HeroSectionProps = {
  profile: Profile | null;
};

const HeroSection = ({ profile }: HeroSectionProps) => {
  const name = profile?.name?.trim() || "Areydra";
  const firstName = name.split(/\s+/)[0] || name;
  const role = profile?.role || "Software Engineer";
  const tagline = profile?.tagline || "Portfolio data is loading from the backend.";
  const years = formatCount(profile?.yearsOfExperience, "+");
  const companies = formatCount(profile?.totalCompanies);

  return (
    <section className="home-hero">
      <div className="home-hero__content">
        <div className="mb-[clamp(18px,3vw,26px)] inline-block border-[3px] border-ink bg-lime px-3 py-1.5 text-[clamp(10px,1.3vw,13px)] font-bold tracking-[1px] text-ink uppercase">
          {role}
        </div>
        <h1 className="font-anton m-0 text-[clamp(52px,11vw,168px)] leading-[0.82] tracking-[-1px] text-ink uppercase">
          Hi,
          <br />
          I&apos;m
          <br />
          <span className="text-azure [webkit-text-stroke:clamp(1.5px,0.3vw,3px)_#111]">{firstName}</span>
        </h1>
        <p className="mt-[clamp(18px,3vw,30px)] max-w-[56ch] text-[clamp(14px,1.6vw,20px)] leading-[1.55] font-medium text-ink">
          {tagline}
        </p>
        <div className="home-action-row">
          <a className="home-action-row__primary" href="#projects">
            View Projects -&gt;
          </a>
          <a className="home-action-row__secondary" href="#contact">
            Get in Touch
          </a>
        </div>
      </div>

      <div className="home-hero__side" aria-hidden="true">
        <div className="home-hero__mark">
          {profile?.avatarUrl ? (
            // Arbitrary remote upload URL: next/image would need every possible
            // host allowlisted, so this keeps the raw <img> with explicit sizing.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt=""
              width={640}
              height={640}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_14px,rgba(255,255,255,0.08)_14px,rgba(255,255,255,0.08)_28px)]" />
              <span className="font-anton relative text-[clamp(80px,15vw,220px)] leading-none text-lime select-none [webkit-text-stroke:clamp(2px,0.4vw,4px)_#111]">
                {firstName.charAt(0).toUpperCase() || "A"}
              </span>
            </>
          )}
        </div>
        <div className="home-hero__mini-stats">
          <MiniStat value={years} label="Years Exp." />
          <MiniStat value={companies} label="Companies" last />
        </div>
      </div>
    </section>
  );
};

type MiniStatProps = {
  value: string;
  label: string;
  last?: boolean;
};

const MiniStat = ({ value, label, last = false }: MiniStatProps) => {
  return (
    <div className={last ? "p-[clamp(16px,2vw,22px)]" : "border-r-[3px] border-ink p-[clamp(16px,2vw,22px)]"}>
      <div className="font-anton text-[clamp(36px,4.5vw,54px)] leading-[0.9] text-ink">{value}</div>
      <div className="mt-1 text-[clamp(10px,1vw,12px)] font-bold tracking-[1px] text-ink uppercase">{label}</div>
    </div>
  );
};

export default HeroSection;
