type SectionStateProps = {
  tone?: "light" | "dark";
  title: string;
  message: string;
};

export function SectionState({ tone = "light", title, message }: SectionStateProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={`p-[clamp(18px,2.5vw,28px)] border-[3px] ${isDark ? "border-[#ebe7d9] bg-[#0f0f0f] text-[#ebe7d9]" : "border-[#111] bg-[#f5f2e8] text-[#111]"}`}
    >
      <div className="text-xs font-bold uppercase tracking-[1px] mb-2">{title}</div>
      <p className="text-sm font-semibold leading-[1.6] m-0">{message}</p>
    </div>
  );
}
