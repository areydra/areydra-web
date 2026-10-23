import type { SkillGroup } from "@/lib/portfolio-api";
import { SectionState } from "./SectionState";

type SkillsSectionProps = {
  skillGroups: SkillGroup[] | null;
  error: string | null;
};

export function SkillsSection({ skillGroups, error }: SkillsSectionProps) {
  const groups = skillGroups ?? [];

  return (
    <section id="skills" className="p-[clamp(24px,5vw,64px)] border-b-4 border-[#111]">
      <div className="text-[clamp(10px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-[#1410ff] mb-3">[ 02 ] Technical Skills</div>
      <h2 className="font-anton text-[clamp(28px,4.5vw,68px)] leading-[0.92] uppercase text-[#111] mb-[clamp(24px,4vw,40px)] tracking-[-0.5px]">
        The Stack
      </h2>
      {error ? (
        <SectionState title="Skills unavailable" message={error} />
      ) : groups.length > 0 ? (
        <div className="home-skill-grid">
          {groups.map((group) => (
            <div key={group.id} className="bg-[#ebe7d9] p-[clamp(16px,2.5vw,28px)]">
              <div className="text-[clamp(10px,1vw,12px)] font-bold uppercase tracking-[1.5px] text-[#1410ff] mb-3.5">{group.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="text-[clamp(11px,1.1vw,13px)] font-bold uppercase tracking-[1px] text-[#111] bg-[#ebe7d9] border-2 border-[#111] px-2.5 py-1"
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
