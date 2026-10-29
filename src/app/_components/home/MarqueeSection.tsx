import type { SkillGroup } from "@/types/api.types";

interface MarqueeSectionProps {
  skillGroups: SkillGroup[] | null;
}

const MarqueeSection = ({ skillGroups }: MarqueeSectionProps) => {
  const skills =
    skillGroups?.flatMap((group) => group.skills.map((skill) => skill.name)).filter(Boolean) ?? [];
  const content =
    skills.length > 0 ? skills.join(" * ") : "PORTFOLIO DATA * API DRIVEN * NEXT.JS *";
  const label = `${content} * `;

  return (
    <div className="border-ink bg-lime overflow-hidden border-b-4 py-[clamp(10px,1.5vw,14px)]">
      <div className="font-anton text-ink inline-flex animate-[bmarquee_60s_linear_infinite] text-[clamp(18px,3vw,30px)] tracking-[1px] whitespace-nowrap uppercase">
        <span className="px-5">{label}</span>
        {/* Duplicate run only exists to make the loop seamless. */}
        <span
          className="px-5"
          aria-hidden="true"
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default MarqueeSection;
