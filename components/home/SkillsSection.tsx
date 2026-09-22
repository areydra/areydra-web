import type { SkillGroup } from "@/lib/portfolio-api";
import { anton, archivo, mono } from "@/components/fonts";
import { SectionState } from "./SectionState";

type SkillsSectionProps = {
  skillGroups: SkillGroup[] | null;
  error: string | null;
};

export function SkillsSection({ skillGroups, error }: SkillsSectionProps) {
  const groups = skillGroups ?? [];

  return (
    <section id="skills" style={{ padding: "clamp(24px, 5vw, 64px)", borderBottom: "4px solid #111" }}>
      <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#1410ff", marginBottom: 12 }}>[ 02 ] Technical Skills</div>
      <h2 style={{ ...anton, fontSize: "clamp(28px,4.5vw,68px)", lineHeight: "0.92", textTransform: "uppercase", color: "#111", margin: "0 0 clamp(24px,4vw,40px)", letterSpacing: -0.5 }}>The Stack</h2>
      {error ? (
        <SectionState title="Skills unavailable" message={error} />
      ) : groups.length > 0 ? (
        <div className="home-skill-grid">
          {groups.map((group) => (
            <div key={group.id} style={{ background: "#ebe7d9", padding: "clamp(16px, 2.5vw, 28px)" }}>
              <div style={{ ...mono, fontSize: "clamp(10px,1vw,12px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#1410ff", marginBottom: 14 }}>{group.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {group.skills.map((skill) => (
                  <span
                    key={skill.id}
                    style={{
                      ...archivo,
                      fontSize: "clamp(11px, 1.1vw, 13px)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#111",
                      background: "#ebe7d9",
                      border: "2px solid #111",
                      padding: "4px 10px",
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SectionState title="No skills" message="No skill groups have been published yet." />
      )}
    </section>
  );
}
