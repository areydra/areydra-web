import type { Profile } from "@/lib/portfolio-api";
import { SectionState } from "./SectionState";

type AboutSectionProps = {
  profile: Profile | null;
  error: string | null;
};

export function AboutSection({ profile, error }: AboutSectionProps) {
  const points = [...(profile?.aboutPoints ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="about" className="home-about">
      <div className="home-about__copy">
        <div className="text-[clamp(10px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-[#1410ff] mb-3.5">
          [ 01 ] About Me
        </div>
        <h2 className="font-anton text-[clamp(28px,4.5vw,68px)] leading-[0.92] uppercase text-[#111] mb-[clamp(16px,2.5vw,26px)] tracking-[-0.5px]">
          {profile?.aboutTitle || "About Me"}
        </h2>
        {error ? (
          <SectionState title="Profile unavailable" message={error} />
        ) : (
          <p className="text-[clamp(14px,1.5vw,16px)] font-medium leading-[1.7] text-[#111] m-0">
            {profile?.aboutDescription || "No profile description has been published yet."}
          </p>
        )}
      </div>

      <div className="home-about__cards">
        {points.length > 0 ? (
          points.map((card, index) => (
            <div key={card.id} className={`p-[clamp(16px,2.5vw,28px)] ${index === 2 ? "bg-[#c8ff00]" : "bg-[#ebe7d9]"}`}>
              <div
                className={`font-anton text-[clamp(22px,3vw,30px)] leading-none ${index === 2 ? "text-[#111]" : "text-[#1410ff] [webkit-text-stroke:1.5px_#111]"}`}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="text-[clamp(13px,1.4vw,17px)] font-extrabold uppercase text-[#111] mt-2.5 mb-1.5">
                {card.title}
              </div>
              <div className="text-[clamp(12px,1.2vw,14px)] font-medium leading-[1.55] text-[#111]">{card.description}</div>
            </div>
          ))
        ) : (
          <div className="bg-[#ebe7d9] p-[clamp(16px,2.5vw,28px)] col-span-full">
            <SectionState title="No about points" message="Profile points have not been published yet." />
          </div>
        )}
      </div>
    </section>
  );
}
