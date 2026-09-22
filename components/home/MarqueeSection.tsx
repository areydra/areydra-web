import type { SkillGroup } from "@/lib/portfolio-api";
import { anton } from "@/components/fonts";

type MarqueeSectionProps = {
  skillGroups: SkillGroup[] | null;
};

export function MarqueeSection({ skillGroups }: MarqueeSectionProps) {
  const skills = skillGroups?.flatMap((group) => group.skills.map((skill) => skill.name)).filter(Boolean) ?? [];
  const content = skills.length > 0 ? skills.join(" * ") : "PORTFOLIO DATA * API DRIVEN * NEXT.JS *";
  const label = `${content} * `;

  return (
    <div style={{ background: "#c8ff00", borderBottom: "4px solid #111", overflow: "hidden", padding: "clamp(10px,1.5vw,14px) 0" }}>
      <div
        style={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          animation: "bmarquee 22s linear infinite",
          ...anton,
          fontSize: "clamp(18px, 3vw, 30px)",
          textTransform: "uppercase",
          color: "#111",
          letterSpacing: 1,
        }}
      >
        <span style={{ padding: "0 20px" }}>{label}</span>
        <span style={{ padding: "0 20px" }} aria-hidden="true">
          {label}
        </span>
      </div>
    </div>
  );
}
