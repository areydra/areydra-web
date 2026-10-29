import type { ReactNode } from "react";

interface StatusStripProps {
  /** Live/clock text. Rendered but hidden from assistive tech: it changes every second. */
  right?: ReactNode;
}

const StatusStrip = ({ right = "BOGOR, ID" }: StatusStripProps) => {
  return (
    <div className="border-ink bg-ink text-paper flex flex-wrap items-center justify-between gap-2 border-b-[3px] px-[clamp(14px,4vw,40px)] py-2 text-[clamp(10px,1.2vw,12px)] font-bold tracking-[1px] uppercase">
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="bg-lime inline-block h-2 w-2 animate-[bblink_1.4s_steps(1)_infinite]"
        />
        AVAILABLE FOR WORK
      </span>
      <span
        aria-hidden="true"
        className="opacity-70"
      >
        {right}
      </span>
    </div>
  );
};

export default StatusStrip;
