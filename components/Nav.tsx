"use client";

import { useEffect, useRef, useState } from "react";
import { anton, mono } from "./fonts";

const NAV_ITEMS = ["About", "Skills", "Work", "Projects", "Blog", "Contact"];

type NavProps = {
  variant: "home" | "subpage" | "detail";
  isMobile?: boolean;
  showInvertToggle?: boolean;
  invert?: boolean;
  onToggleInvert?: () => void;
  backHref?: string;
  backLabel?: string;
  /** Hide the "Projects" nav link when there's no project data to show/link to. */
  hasProjects?: boolean;
  /** Hide the "Blog" nav link when there's no blog post data to show/link to. */
  hasBlog?: boolean;
};

export function Nav({ variant, isMobile = false, showInvertToggle = false, invert = false, onToggleInvert, backHref = "/blog", backLabel = "← All Posts", hasProjects = true, hasBlog = true }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navItems = NAV_ITEMS.filter((item) => (item !== "Projects" || hasProjects) && (item !== "Blog" || hasBlog));

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const navHeight = navRef.current?.offsetHeight ?? 58;
  const anchorHref = (item: string) => (variant === "home" ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`);
  const logoHref = variant === "home" ? "#" : "/";

  if (variant === "detail") {
    return (
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 500,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          background: "#ebe7d9",
          borderBottom: "4px solid #111",
        }}
      >
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", borderRight: "4px solid #111", flexShrink: 0 }}>
          <span
            style={{
              ...anton,
              background: "#1410ff",
              color: "#fff",
              fontSize: "clamp(22px, 3.5vw, 30px)",
              lineHeight: "1",
              padding: "clamp(10px,1.5vw,14px) clamp(12px,2vw,18px) clamp(8px,1.2vw,10px)",
              letterSpacing: 1,
            }}
          >
            AR
          </span>
          <span
            style={{
              ...anton,
              fontSize: "clamp(16px, 2.5vw, 24px)",
              color: "#111",
              padding: "0 clamp(10px, 2vw, 18px)",
              letterSpacing: 1,
              whiteSpace: "nowrap",
            }}
          >
            AREYDRA
          </span>
        </a>
        <a
          href={backHref}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 clamp(14px, 2vw, 24px)",
            ...mono,
            fontSize: "clamp(11px, 1.2vw, 13px)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "#fff",
            background: "#1410ff",
            textDecoration: "none",
            borderLeft: "4px solid #111",
            whiteSpace: "nowrap",
          }}
        >
          {backLabel}
        </a>
      </nav>
    );
  }

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 500,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          background: "#ebe7d9",
          borderBottom: "4px solid #111",
        }}
      >
        <a href={logoHref} style={{ display: "flex", alignItems: "center", textDecoration: "none", borderRight: "4px solid #111", flexShrink: 0 }}>
          <span
            style={{
              ...anton,
              background: "#1410ff",
              color: "#fff",
              fontSize: "clamp(22px, 3.5vw, 30px)",
              lineHeight: "1",
              padding: "clamp(10px,1.5vw,14px) clamp(12px,2vw,18px) clamp(8px,1.2vw,10px)",
              letterSpacing: 1,
            }}
          >
            AR
          </span>
          <span
            style={{
              ...anton,
              fontSize: "clamp(16px, 2.5vw, 24px)",
              color: "#111",
              padding: "0 clamp(10px, 2vw, 18px)",
              letterSpacing: 1,
              whiteSpace: "nowrap",
            }}
          >
            AREYDRA
          </span>
        </a>

        {/* Desktop + tablet nav links */}
        {!isMobile && (
        <div style={{ display: "flex", alignItems: "stretch", overflowX: "auto" }}>
          {navItems.map((item) => (
            <a
              key={item}
              href={anchorHref(item)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 clamp(10px, 1.5vw, 20px)",
                ...mono,
                fontSize: "clamp(10px, 1.2vw, 13px)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#111",
                textDecoration: "none",
                borderLeft: "2px solid #111",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#c8ff00")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {item}
            </a>
          ))}
          {showInvertToggle && (
            <button
              onClick={onToggleInvert}
              style={{
                cursor: "pointer",
                padding: "0 clamp(10px, 1.5vw, 20px)",
                ...mono,
                fontSize: "clamp(10px, 1.2vw, 13px)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#ebe7d9",
                background: "#111",
                border: "none",
                borderLeft: "4px solid #111",
                whiteSpace: "nowrap",
              }}
            >
              [ {invert ? "LIGHT" : "INVERT"} ]
            </button>
          )}
        </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {showInvertToggle && (
            <button
              onClick={onToggleInvert}
              style={{
                cursor: "pointer",
                padding: "0 14px",
                ...mono,
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#ebe7d9",
                background: "#111",
                border: "none",
                borderLeft: "4px solid #111",
              }}
            >
              INV
            </button>
          )}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              cursor: "pointer",
              padding: "0 18px",
              ...anton,
              fontSize: 26,
              color: "#111",
              background: "#ebe7d9",
              border: "none",
              borderLeft: "4px solid #111",
              lineHeight: "1",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        )}
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: navHeight,
            left: 0,
            right: 0,
            zIndex: 499,
            background: "#ebe7d9",
            borderBottom: "4px solid #111",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {navItems.map((item, i, arr) => (
            <a
              key={item}
              href={anchorHref(item)}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "18px 24px",
                ...anton,
                fontSize: 28,
                textTransform: "uppercase",
                color: "#111",
                textDecoration: "none",
                borderBottom: i < arr.length - 1 ? "3px solid #111" : undefined,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#c8ff00")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
