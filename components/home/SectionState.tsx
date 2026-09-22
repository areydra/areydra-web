import { archivo, mono } from "@/components/fonts";

type SectionStateProps = {
  tone?: "light" | "dark";
  title: string;
  message: string;
};

export function SectionState({ tone = "light", title, message }: SectionStateProps) {
  const isDark = tone === "dark";

  return (
    <div
      style={{
        border: `3px solid ${isDark ? "#ebe7d9" : "#111"}`,
        background: isDark ? "#0f0f0f" : "#f5f2e8",
        color: isDark ? "#ebe7d9" : "#111",
        padding: "clamp(18px,2.5vw,28px)",
      }}
    >
      <div style={{ ...mono, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{title}</div>
      <p style={{ ...archivo, fontSize: 14, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{message}</p>
    </div>
  );
}
