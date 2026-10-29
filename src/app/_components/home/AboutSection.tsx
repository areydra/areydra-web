import SectionState from "@/components/common/SectionState";
import { cn } from "@/lib/cn";
import type { Profile } from "@/types/api.types";

interface AboutSectionProps {
  profile: Profile | null;
  error: string | null;
}

const AboutSection = ({ profile, error }: AboutSectionProps) => {
  const points = [...(profile?.aboutPoints ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      id="about"
      className="home-about"
    >
      <div className="home-about__copy">
        <div className="text-azure mb-3.5 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
          [ 01 ] About Me
        </div>
        <h2 className="font-anton text-ink mb-[clamp(16px,2.5vw,26px)] text-[clamp(28px,4.5vw,68px)] leading-[0.92] tracking-[-0.5px] uppercase">
          {profile?.aboutTitle || "About Me"}
        </h2>
        {error ? (
          <SectionState
            title="Profile unavailable"
            message={error}
          />
        ) : (
          <p className="text-ink m-0 text-[clamp(14px,1.5vw,16px)] leading-[1.7] font-medium">
            {profile?.aboutDescription || "No profile description has been published yet."}
          </p>
        )}
      </div>

      <div className="home-about__cards">
        {points.length > 0 ? (
          points.map((card, index) => (
            <div
              key={card.id}
              className={cn("p-[clamp(16px,2.5vw,28px)]", index === 2 ? "bg-lime" : "bg-paper")}
            >
              <div
                className={cn(
                  "font-anton text-[clamp(22px,3vw,30px)] leading-none",
                  index === 2 ? "text-ink" : "text-azure [webkit-text-stroke:1.5px_#111]",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="text-ink mt-2.5 mb-1.5 text-[clamp(13px,1.4vw,17px)] font-extrabold uppercase">
                {card.title}
              </div>
              <div className="text-ink text-[clamp(12px,1.2vw,14px)] leading-[1.55] font-medium">
                {card.description}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-paper col-span-full p-[clamp(16px,2.5vw,28px)]">
            <SectionState
              title="No about points"
              message="Profile points have not been published yet."
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
