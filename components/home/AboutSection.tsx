import type { Profile } from "@/lib/portfolio-api";
import { anton, archivo, mono } from "@/components/fonts";
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
        <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#1410ff", marginBottom: 14 }}>[ 01 ] About Me</div>
        <h2
          style={{
            ...anton,
            fontSize: "clamp(28px, 4.5vw, 68px)",
            lineHeight: "0.92",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 clamp(16px,2.5vw,26px)",
            letterSpacing: -0.5,
          }}
        >
          {profile?.aboutTitle || "About Me"}
        </h2>
        {error ? (
          <SectionState title="Profile unavailable" message={error} />
        ) : (
          <p style={{ ...archivo, fontSize: "clamp(14px,1.5vw,16px)", fontWeight: 500, lineHeight: 1.7, color: "#111", margin: 0 }}>{profile?.aboutDescription || "No profile description has been published yet."}</p>
        )}
      </div>

      <div className="home-about__cards">
        {points.length > 0 ? (
          points.map((card, index) => (
            <div
              key={card.id}
              style={{
                background: index === 2 ? "#c8ff00" : "#ebe7d9",
                padding: "clamp(16px, 2.5vw, 28px)",
              }}
            >
              <div
                style={{
                  ...anton,
                  fontSize: "clamp(22px, 3vw, 30px)",
                  color: index === 2 ? "#111" : "#1410ff",
                  lineHeight: "1",
                  WebkitTextStroke: index === 2 ? undefined : "1.5px #111",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div style={{ ...archivo, fontSize: "clamp(13px,1.4vw,17px)", fontWeight: 800, textTransform: "uppercase", color: "#111", margin: "10px 0 6px" }}>{card.title}</div>
              <div style={{ ...archivo, fontSize: "clamp(12px,1.2vw,14px)", fontWeight: 500, lineHeight: 1.55, color: "#111" }}>{card.description}</div>
            </div>
          ))
        ) : (
          <div style={{ background: "#ebe7d9", padding: "clamp(16px, 2.5vw, 28px)", gridColumn: "1 / -1" }}>
            <SectionState title="No about points" message="Profile points have not been published yet." />
          </div>
        )}
      </div>
    </section>
  );
}
