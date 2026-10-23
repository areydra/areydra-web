import type { Profile } from "@/lib/portfolio-api";
import { formatCount } from "./formatters";

type HeroSectionProps = {
  profile: Profile | null;
};

export function HeroSection({ profile }: HeroSectionProps) {
  const name = profile?.name?.trim() || "Areydra";
  const firstName = name.split(/\s+/)[0] || name;
  const role = profile?.role || "Software Engineer";
  const tagline = profile?.tagline || "Portfolio data is loading from the backend.";
  const years = formatCount(profile?.yearsOfExperience, "+");
  const companies = formatCount(profile?.totalCompanies);

  return (
    <section className="home-hero">
      <div className="home-hero__content">
        <div className="inline-block text-[clamp(10px,1.3vw,13px)] font-bold uppercase tracking-[1px] text-[#111] bg-[#c8ff00] border-[3px] border-[#111] px-3 py-1.5 mb-[clamp(18px,3vw,26px)]">
          {role}
        </div>
        <h1 className="font-anton text-[clamp(52px,11vw,168px)] leading-[0.82] tracking-[-1px] text-[#111] m-0 uppercase">
          Hi,
          <br />
          I&apos;m
          <br />
          <span className="text-[#1410ff] [webkit-text-stroke:clamp(1.5px,0.3vw,3px)_#111]">{firstName}</span>
        </h1>
        <p className="text-[clamp(14px,1.6vw,20px)] font-medium leading-[1.55] text-[#111] max-w-[56ch] mt-[clamp(18px,3vw,30px)]">
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
            // eslint-disable-next-line @next/next/no-img-element -- avatarUrl is an arbitrary uploaded/remote image, not a local asset
            <img src={profile.avatarUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_14px,rgba(255,255,255,0.08)_14px,rgba(255,255,255,0.08)_28px)]" />
              <span className="font-anton text-[clamp(80px,15vw,220px)] text-[#c8ff00] leading-none relative [webkit-text-stroke:clamp(2px,0.4vw,4px)_#111] select-none">
                {firstName[0]?.toUpperCase() || "A"}
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
}

function MiniStat({ value, label, last = false }: { value: string; label: string; last?: boolean }) {
  return (
    <div className={`p-[clamp(16px,2vw,22px)] ${!last ? "border-r-[3px] border-[#111]" : ""}`}>
      <div className="font-anton text-[clamp(36px,4.5vw,54px)] text-[#111] leading-[0.9]">{value}</div>
      <div className="text-[clamp(10px,1vw,12px)] font-bold uppercase tracking-[1px] text-[#111] mt-1">{label}</div>
    </div>
  );
}
