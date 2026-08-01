import type { ReactNode } from "react";
import { mono } from "./fonts";

export function StatusStrip({ right = "BOGOR, ID" }: { right?: ReactNode }) {
  return (
    <div
      style={{
        background: "#111",
        color: "#ebe7d9",
        ...mono,
        fontSize: "clamp(10px, 1.2vw, 12px)",
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px clamp(14px, 4vw, 40px)",
        borderBottom: "3px solid #111",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 8,
            height: 8,
            background: "#c8ff00",
            display: "inline-block",
            animation: "bblink 1.4s steps(1) infinite",
          }}
        />
        AVAILABLE FOR WORK
      </span>
      <span style={{ opacity: 0.7 }}>{right}</span>
    </div>
  );
}
