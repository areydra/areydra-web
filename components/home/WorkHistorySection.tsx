import type { WorkHistory } from "@/lib/portfolio-api";
import { sanitizeHtml } from "@/lib/majourney/html";
import { formatWorkPeriod } from "./formatters";
import { SectionState } from "./SectionState";

type WorkHistorySectionProps = {
  jobs: WorkHistory[] | null;
  error: string | null;
};

export function WorkHistorySection({ jobs, error }: WorkHistorySectionProps) {
  const items = jobs ?? [];

  return (
    <section id="work" className="border-b-4 border-[#111]">
      <div className="pt-[clamp(24px,5vw,64px)] px-[clamp(24px,5vw,64px)]">
        <div className="text-[clamp(10px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-[#1410ff] mb-3">[ 03 ] Work History</div>
        <h2 className="font-anton text-[clamp(28px,4.5vw,68px)] leading-[0.92] uppercase text-[#111] mb-[clamp(24px,4vw,40px)] tracking-[-0.5px]">
          Where I&apos;ve Worked
        </h2>
      </div>
      {error ? (
        <div className="px-[clamp(24px,5vw,64px)] pb-[clamp(24px,5vw,64px)]">
          <SectionState title="Work history unavailable" message={error} />
        </div>
      ) : items.length > 0 ? (
        items.map((job, index) => (
          <div
            key={job.id}
            className="flex gap-[clamp(14px,3vw,40px)] items-start px-[clamp(24px,5vw,64px)] py-[clamp(20px,3vw,40px)] border-t-[3px] border-[#111]"
          >
            <div className="font-anton text-[clamp(32px,5vw,80px)] text-[#1410ff] leading-[0.8] [webkit-text-stroke:clamp(1px,0.3vw,2px)_#111] min-w-[clamp(60px,8vw,110px)] shrink-0">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="home-work-heading">
                <h3 className="text-[clamp(17px,2.2vw,30px)] font-black uppercase text-[#111] m-0">{job.role}</h3>
                <div className="home-work-period">{formatWorkPeriod(job.startMonth, job.startYear, job.endMonth, job.endYear)}</div>
              </div>
              <div className="text-[clamp(13px,1.4vw,15px)] font-bold tracking-[1px] text-[#1410ff]">{job.company}{job.status ? ` - ${job.status.replace(/_/g, " ")}` : ""}</div>
              <div
                className="rich-text-content text-[clamp(13px,1.3vw,15px)] font-medium leading-[1.6] text-[#111] mt-3"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="px-[clamp(24px,5vw,64px)] pb-[clamp(24px,5vw,64px)]">
          <SectionState title="No work history" message="No work history entries have been published yet." />
        </div>
      )}
    </section>
  );
}
