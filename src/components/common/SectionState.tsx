import { cn } from "@/lib/cn";

interface SectionStateProps {
  tone?: "light" | "dark";
  title: string;
  message: string;
}

/**
 * Empty/error state for a homepage section. It is a status region so a failed
 * fetch is announced rather than silently rendering an empty section.
 */
const SectionState = ({ tone = "light", title, message }: SectionStateProps) => {
  const isDark = tone === "dark";

  return (
    <div
      role="status"
      className={cn(
        "border-[3px] p-[clamp(18px,2.5vw,28px)]",
        isDark ? "border-paper bg-ink text-paper" : "border-ink bg-paper-soft text-ink",
      )}
    >
      <div className="mb-2 text-xs font-bold tracking-[1px] uppercase">{title}</div>
      <p className="m-0 line-clamp-3 text-sm leading-[1.6] font-semibold">{message}</p>
    </div>
  );
};

export default SectionState;
