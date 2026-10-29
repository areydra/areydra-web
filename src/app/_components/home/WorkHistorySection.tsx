import SectionState from "@/components/common/SectionState";
import { formatWorkPeriod } from "@/lib/format";
import { sanitizeHtml } from "@/lib/sanitize-html";
import type { WorkHistory } from "@/types/api.types";

interface WorkHistorySectionProps {
  jobs: WorkHistory[] | null;
  error: string | null;
}

const WorkHistorySection = ({ jobs, error }: WorkHistorySectionProps) => {
  const items = jobs ?? [];

  return (
    <section
      id="work"
      className="border-ink border-b-4"
    >
      <div className="px-[clamp(24px,5vw,64px)] pt-[clamp(24px,5vw,64px)]">
        <div className="text-azure mb-3 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
          [ 03 ] Work History
        </div>
        <h2 className="font-anton text-ink mb-[clamp(24px,4vw,40px)] text-[clamp(28px,4.5vw,68px)] leading-[0.92] tracking-[-0.5px] uppercase">
          Where I&apos;ve Worked
        </h2>
      </div>
      {error ? (
        <div className="px-[clamp(24px,5vw,64px)] pb-[clamp(24px,5vw,64px)]">
          <SectionState
            title="Work history unavailable"
            message={error}
          />
        </div>
      ) : items.length > 0 ? (
        items.map((job, index) => (
          <div
            key={job.id}
            className="border-ink flex items-start gap-[clamp(14px,3vw,40px)] border-t-[3px] px-[clamp(24px,5vw,64px)] py-[clamp(20px,3vw,40px)]"
          >
            <div className="font-anton text-azure min-w-[clamp(60px,8vw,110px)] shrink-0 text-[clamp(32px,5vw,80px)] leading-[0.8] [webkit-text-stroke:clamp(1px,0.3vw,2px)_#111]">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="home-work-heading">
                <h3 className="text-ink m-0 text-[clamp(17px,2.2vw,30px)] font-black uppercase">
                  {job.role}
                </h3>
                <div className="home-work-period">
                  {formatWorkPeriod(job.startMonth, job.startYear, job.endMonth, job.endYear)}
                </div>
              </div>
              <div className="text-azure text-[clamp(13px,1.4vw,15px)] font-bold tracking-[1px]">
                {job.company}
                {job.status ? ` - ${job.status.replace(/_/g, " ")}` : ""}
              </div>
              <div
                className="rich-text-content text-ink mt-3 text-[clamp(13px,1.3vw,15px)] leading-[1.6] font-medium"
                // Editor output, sanitized server-side against an allowlist.
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="px-[clamp(24px,5vw,64px)] pb-[clamp(24px,5vw,64px)]">
          <SectionState
            title="No work history"
            message="No work history entries have been published yet."
          />
        </div>
      )}
    </section>
  );
};

export default WorkHistorySection;
