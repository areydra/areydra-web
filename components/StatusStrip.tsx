import type { ReactNode } from "react";

export function StatusStrip({ right = "BOGOR, ID" }: { right?: ReactNode }) {
  return (
    <div className="bg-[#111] text-[#ebe7d9] text-[clamp(10px,1.2vw,12px)] font-bold tracking-[1px] uppercase flex items-center justify-between px-[clamp(14px,4vw,40px)] py-2 border-b-[3px] border-[#111] gap-2 flex-wrap">
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 bg-[#c8ff00] inline-block animate-[bblink_1.4s_steps(1)_infinite]" />
        AVAILABLE FOR WORK
      </span>
      <span className="opacity-70">{right}</span>
    </div>
  );
}
