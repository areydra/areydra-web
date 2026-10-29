import SectionState from "@/components/common/SectionState";
import type { SkillGroup } from "@/types/api.types";

interface SkillsSectionProps {
  skillGroups: SkillGroup[] | null;
  error: string | null;
}

const SkillsSection = ({ skillGroups, error }: SkillsSectionProps) => {
  const groups = skillGroups ?? [];

  return (
    <section
      id="skills"
      className="border-ink border-b-4 p-[clamp(24px,5vw,64px)]"
    >
      <div className="text-azure mb-3 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
        [ 02 ] Technical Skills
      </div>
      <h2 className="font-anton text-ink mb-[clamp(24px,4vw,40px)] text-[clamp(28px,4.5vw,68px)] leading-[0.92] tracking-[-0.5px] uppercase">
        The Stack
      </h2>
      {error ? (
        <SectionState
          title="Skills unavailable"
          message={error}
        />
      ) : groups.length > 0 ? (
        <div className="home-skill-grid">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-paper p-[clamp(16px,2.5vw,28px)]"
            >
              <div className="text-azure mb-3.5 text-[clamp(10px,1vw,12px)] font-bold tracking-[1.5px] uppercase">
                {group.name}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="border-ink bg-paper text-ink border-2 px-2.5 py-1 text-[clamp(11px,1.1vw,13px)] font-bold tracking-[1px] uppercase"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SectionState
          title="No skills"
          message="No skill groups have been published yet."
        />
      )}
    </section>
  );
};

export default SkillsSection;
