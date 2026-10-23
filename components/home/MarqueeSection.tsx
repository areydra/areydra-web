import type { SkillGroup } from "@/lib/portfolio-api";

type MarqueeSectionProps = {
  skillGroups: SkillGroup[] | null;
};

export function MarqueeSection({ skillGroups }: MarqueeSectionProps) {
  const skills = skillGroups?.flatMap((group) => group.skills.map((skill) => skill.name)).filter(Boolean) ?? [];
  const content = skills.length > 0 ? skills.join(" * ") : "PORTFOLIO DATA * API DRIVEN * NEXT.JS *";
  const label = `${content} * `;

  return (
    <div className="bg-[#c8ff00] border-b-4 border-[#111] overflow-hidden py-[clamp(10px,1.5vw,14px)]">
      <div className="font-anton inline-flex whitespace-nowrap animate-[bmarquee_60s_linear_infinite] text-[clamp(18px,3vw,30px)] uppercase text-[#111] tracking-[1px]">
        <span className="px-5">{label}</span>
        <span className="px-5" aria-hidden="true">
          {label}
        </span>
      </div>
    </div>
  );
}
