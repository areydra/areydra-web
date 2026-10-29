import { formatCount } from "@/lib/format";
import type { Profile, SkillGroup, WorkHistory } from "@/types/api.types";

interface StatsSectionProps {
  profile: Profile | null;
  skillGroups: SkillGroup[] | null;
  workHistory: WorkHistory[] | null;
}

const StatsSection = ({ profile, skillGroups, workHistory }: StatsSectionProps) => {
  const skillCount = skillGroups?.reduce((total, group) => total + group.skills.length, 0) ?? 0;
  const stats = [
    { val: formatCount(profile?.yearsOfExperience, "+"), label: "Years Exp." },
    { val: formatCount(workHistory?.length ?? 0), label: "Roles Held" },
    { val: formatCount(profile?.totalCompanies), label: "Companies" },
    { val: formatCount(skillCount), label: "Skills" },
  ];

  return (
    <div className="border-ink bg-ink grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-[1px] border-b-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-paper px-[clamp(14px,3vw,40px)] py-[clamp(20px,3vw,34px)]"
        >
          <div className="font-anton text-azure text-[clamp(36px,5vw,72px)] leading-[0.9] [webkit-text-stroke:clamp(1px,0.2vw,2px)_#111]">
            {stat.val}
          </div>
          <div className="text-ink mt-2 text-[clamp(10px,1vw,12px)] font-bold tracking-[1px] uppercase">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
