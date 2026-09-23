import type { WorkHistory } from "@/lib/portfolio-api";
import { anton, archivo, mono } from "@/components/fonts";
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
    <section id="work" style={{ borderBottom: "4px solid #111" }}>
      <div style={{ padding: "clamp(24px,5vw,64px) clamp(24px,5vw,64px) 0" }}>
        <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#1410ff", marginBottom: 12 }}>[ 03 ] Work History</div>
        <h2 style={{ ...anton, fontSize: "clamp(28px,4.5vw,68px)", lineHeight: "0.92", textTransform: "uppercase", color: "#111", margin: "0 0 clamp(24px,4vw,40px)", letterSpacing: -0.5 }}>
          Where I&apos;ve Worked
        </h2>
      </div>
      {error ? (
        <div style={{ padding: "0 clamp(24px,5vw,64px) clamp(24px,5vw,64px)" }}>
          <SectionState title="Work history unavailable" message={error} />
        </div>
      ) : items.length > 0 ? (
        items.map((job, index) => (
          <div
            key={job.id}
            style={{
              display: "flex",
              gap: "clamp(14px, 3vw, 40px)",
              alignItems: "flex-start",
              padding: "clamp(20px,3vw,40px) clamp(24px,5vw,64px)",
              borderTop: "3px solid #111",
            }}
          >
            <div
              style={{
                ...anton,
                fontSize: "clamp(32px, 5vw, 80px)",
                color: "#1410ff",
                lineHeight: "0.8",
                WebkitTextStroke: "clamp(1px,0.3vw,2px) #111",
                minWidth: "clamp(60px, 8vw, 110px)",
                flexShrink: 0,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="home-work-heading">
                <h3 style={{ ...archivo, fontSize: "clamp(17px,2.2vw,30px)", fontWeight: 900, textTransform: "uppercase", color: "#111", margin: 0 }}>{job.role}</h3>
                <div className="home-work-period">{formatWorkPeriod(job.startMonth, job.startYear, job.endMonth, job.endYear)}</div>
              </div>
              <div style={{ ...mono, fontSize: "clamp(13px,1.4vw,15px)", fontWeight: 700, color: "#1410ff" }}>
                {job.company}
                {job.status ? ` - ${job.status.replace(/_/g, " ")}` : ""}
              </div>
              <div
                className="rich-text-content"
                style={{ ...archivo, fontSize: "clamp(13px,1.3vw,15px)", fontWeight: 500, lineHeight: 1.6, color: "#111", margin: "12px 0 0" }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
              />
            </div>
          </div>
        ))
      ) : (
        <div style={{ padding: "0 clamp(24px,5vw,64px) clamp(24px,5vw,64px)" }}>
          <SectionState title="No work history" message="No work history entries have been published yet." />
        </div>
      )}
    </section>
  );
}
