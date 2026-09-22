import type { Profile, SkillGroup, WorkHistory } from "@/lib/portfolio-api";
import { anton, mono } from "@/components/fonts";
import { formatCount } from "./formatters";

type StatsSectionProps = {
  profile: Profile | null;
  skillGroups: SkillGroup[] | null;
  workHistory: WorkHistory[] | null;
};

export function StatsSection({ profile, skillGroups, workHistory }: StatsSectionProps) {
  const skillCount = skillGroups?.reduce((total, group) => total + group.skills.length, 0) ?? 0;
  const stats = [
    { val: formatCount(profile?.yearsOfExperience, "+"), label: "Years Exp." },
    { val: formatCount(workHistory?.length ?? 0), label: "Roles Held" },
    { val: formatCount(profile?.totalCompanies), label: "Companies" },
    { val: formatCount(skillCount), label: "Skills" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        background: "#111",
        gap: 3,
        borderBottom: "4px solid #111",
      }}
    >
      {stats.map((stat) => (
        <div key={stat.label} style={{ background: "#ebe7d9", padding: "clamp(20px,3vw,34px) clamp(14px,3vw,40px)" }}>
          <div style={{ ...anton, fontSize: "clamp(36px,5vw,72px)", color: "#1410ff", lineHeight: "0.9", WebkitTextStroke: "clamp(1px,0.2vw,2px) #111" }}>{stat.val}</div>
          <div style={{ ...mono, fontSize: "clamp(10px,1vw,12px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#111", marginTop: 8 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
