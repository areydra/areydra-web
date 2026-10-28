"use client";

import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/cn";

const NAV_ITEMS = ["About", "Skills", "Work", "Projects", "Blog", "Contact"];

type NavVariant = "home" | "subpage" | "detail";

type NavProps = {
  variant: NavVariant;
  showInvertToggle?: boolean;
  invert?: boolean;
  onToggleInvert?: () => void;
  backHref?: string;
  backLabel?: string;
  hasProjects?: boolean;
  hasBlog?: boolean;
};

const Nav = ({
  variant,
  showInvertToggle = false,
  invert = false,
  onToggleInvert,
  backHref = "/blog",
  backLabel = "← All Posts",
  hasProjects = true,
  hasBlog = true,
}: NavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = NAV_ITEMS.filter(
    (item) => (item !== "Projects" || hasProjects) && (item !== "Blog" || hasBlog),
  );
  const anchorHref = (item: string) =>
    variant === "home" ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`;

  const brand = (
    <Link href="/" className="flex shrink-0 items-center border-r-4 border-ink no-underline">
      <span className="font-anton bg-azure px-[clamp(12px,2vw,18px)] pt-[clamp(10px,1.5vw,14px)] pb-[clamp(8px,1.2vw,10px)] text-[clamp(22px,3.5vw,30px)] leading-none tracking-[1px] text-white">
        AR
      </span>
      <span className="font-anton whitespace-nowrap px-[clamp(10px,2vw,18px)] text-[clamp(16px,2.5vw,24px)] tracking-[1px] text-ink">
        AREYDRA
      </span>
    </Link>
  );

  if (variant === "detail") {
    return (
      <nav
        aria-label="Primary"
        className="sticky top-0 z-500 flex items-stretch justify-between border-b-4 border-ink bg-paper"
      >
        {brand}
        <Link
          href={backHref}
          className="flex items-center whitespace-nowrap border-l-4 border-ink bg-azure px-[clamp(14px,2vw,24px)] text-[clamp(11px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-white no-underline"
        >
          {backLabel}
        </Link>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-500 flex items-stretch justify-between border-b-4 border-ink bg-paper"
    >
      {brand}

      {/* Visibility is a CSS decision: no viewport measurement, no hydration flash. */}
      <div className="hidden items-stretch overflow-x-auto md:flex">
        {navItems.map((item) => (
          <a
            key={item}
            href={anchorHref(item)}
            className="flex items-center whitespace-nowrap border-l-2 border-ink px-[clamp(10px,1.5vw,20px)] text-[clamp(10px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-ink no-underline transition-colors hover:bg-lime"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-stretch md:hidden">
        {showInvertToggle && (
          <button
            type="button"
            onClick={onToggleInvert}
            aria-pressed={invert}
            className="cursor-pointer border-l-4 border-ink bg-ink px-3.5 text-[11px] font-bold uppercase tracking-[1px] text-paper"
          >
            INV
          </button>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="font-anton cursor-pointer border-l-4 border-ink bg-paper px-[18px] text-[26px] leading-none text-ink"
        >
          <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <div
          id="nav-mobile-menu"
          className="absolute top-full right-0 left-0 flex flex-col border-b-4 border-ink bg-paper md:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item}
              href={anchorHref(item)}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "font-anton block px-6 py-[18px] text-[28px] uppercase text-ink no-underline transition-colors hover:bg-lime",
                "border-b-[3px] border-ink last:border-b-0",
              )}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Nav;
