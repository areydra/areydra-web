import { anton, mono } from "./fonts";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/areydra" },
  { label: "LinkedIn", href: "https://linkedin.com/in/areydra" },
  { label: "Email", href: "mailto:areydra@gmail.com" },
];

export function Footer({ subpage = false }: { subpage?: boolean }) {
  return (
    <footer
      style={{
        background: "#111",
        color: "#ebe7d9",
        padding: "clamp(24px,4vw,48px) clamp(24px,5vw,64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        borderTop: subpage ? "4px solid #111" : undefined,
      }}
    >
      <span style={{ ...anton, fontSize: "clamp(24px,4vw,38px)", textTransform: "uppercase", color: "#ebe7d9", letterSpacing: 1 }}>
        AREYDRA<span style={{ color: "#c8ff00" }}>.</span>
      </span>
      {!subpage && (
        <div style={{ display: "flex", gap: 0, border: "2px solid #ebe7d9", flexWrap: "wrap" }}>
          {socialLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                ...mono,
                fontSize: "clamp(10px,1.1vw,12px)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#ebe7d9",
                padding: "clamp(8px,1vw,10px) clamp(12px,1.5vw,18px)",
                textDecoration: "none",
                borderLeft: i > 0 ? "2px solid #ebe7d9" : undefined,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1410ff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      <span style={{ ...mono, fontSize: "clamp(9px,1vw,12px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, opacity: 0.6 }}>Bogor, ID — © 2026</span>
    </footer>
  );
}
