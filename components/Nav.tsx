"use client";

import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = ["About", "Skills", "Work", "Projects", "Blog", "Contact"];

type NavProps = {
  variant: "home" | "subpage" | "detail";
  isMobile?: boolean;
  showInvertToggle?: boolean;
  invert?: boolean;
  onToggleInvert?: () => void;
  backHref?: string;
  backLabel?: string;
  hasProjects?: boolean;
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
      <nav className="sticky top-0 z-[500] flex items-stretch justify-between bg-[#ebe7d9] border-b-4 border-[#111]">
        <a href="/" className="flex items-center no-underline border-r-4 border-[#111] shrink-0">
          <span className="font-anton bg-[#1410ff] text-white text-[clamp(22px,3.5vw,30px)] leading-none px-[clamp(12px,2vw,18px)] py-[clamp(10px,1.5vw,14px)] pb-[clamp(8px,1.2vw,10px)] tracking-[1px]">AR</span>
          <span className="font-anton text-[clamp(16px,2.5vw,24px)] text-[#111] px-[clamp(10px,2vw,18px)] tracking-[1px] whitespace-nowrap">AREYDRA</span>
        </a>
        <a
          href={backHref}
          className="flex items-center px-[clamp(14px,2vw,24px)] text-[clamp(11px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-white bg-[#1410ff] no-underline border-l-4 border-[#111] whitespace-nowrap"
        >
          {backLabel}
        </a>
      </nav>
    );
  }

  return (
    <>
      <nav ref={navRef} className="sticky top-0 z-[500] flex items-stretch justify-between bg-[#ebe7d9] border-b-4 border-[#111]">
        <a href={logoHref} className="flex items-center no-underline border-r-4 border-[#111] shrink-0">
          <span className="font-anton bg-[#1410ff] text-white text-[clamp(22px,3.5vw,30px)] leading-none px-[clamp(12px,2vw,18px)] py-[clamp(10px,1.5vw,14px)] pb-[clamp(8px,1.2vw,10px)] tracking-[1px]">AR</span>
          <span className="font-anton text-[clamp(16px,2.5vw,24px)] text-[#111] px-[clamp(10px,2vw,18px)] tracking-[1px] whitespace-nowrap">AREYDRA</span>
        </a>

        {!isMobile && (
          <div className="flex items-stretch overflow-x-auto">
            {navItems.map((item) => (
              <a
                key={item}
                href={anchorHref(item)}
                className="flex items-center px-[clamp(10px,1.5vw,20px)] text-[clamp(10px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-[#111] no-underline border-l-2 border-[#111] whitespace-nowrap hover:bg-[#c8ff00] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        )}

        {isMobile && (
          <div className="flex items-stretch">
            {showInvertToggle && (
              <button
                onClick={onToggleInvert}
                className="cursor-pointer px-3.5 text-[11px] font-bold uppercase tracking-[1px] text-[#ebe7d9] bg-[#111] border-none border-l-4 border-[#111]"
              >
                INV
              </button>
            )}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="font-anton cursor-pointer px-[18px] text-[26px] text-[#111] bg-[#ebe7d9] border-none border-l-4 border-[#111] leading-none"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        )}
      </nav>

      {menuOpen && (
        <div
          className="fixed left-0 right-0 z-[499] bg-[#ebe7d9] border-b-4 border-[#111] flex flex-col"
          style={{ top: navHeight }}
        >
          {navItems.map((item, i, arr) => (
            <a
              key={item}
              href={anchorHref(item)}
              onClick={() => setMenuOpen(false)}
              className={`font-anton block px-6 py-[18px] text-[28px] uppercase text-[#111] no-underline hover:bg-[#c8ff00] transition-colors ${i < arr.length - 1 ? "border-b-[3px] border-[#111]" : ""}`}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
