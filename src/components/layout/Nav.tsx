"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { NAV_ITEMS } from "@/constants/nav";
import { cn } from "@/lib/cn";

type NavVariant = "home" | "subpage" | "detail";

interface NavProps {
  /** A nav item disappears when its collection is empty. */
  hasProjects?: boolean;
  hasBlog?: boolean;
}

/** Detail pages go back to their collection; the label follows the segment. */
const DETAIL_BACK: Record<string, { href: string; label: string }> = {
  blog: { href: "/blog", label: "← All Posts" },
  projects: { href: "/", label: "← Back Home" },
};

/**
 * The nav is a layout concern, so it derives its own shape from the route
 * instead of taking a `variant` prop from every page. One instance in the
 * layout means it survives navigation and route loading — the fallback only
 * replaces page content.
 */
const variantFor = (pathname: string): NavVariant => {
  if (pathname === "/") return "home";

  const segments = pathname.split("/").filter(Boolean);
  return segments.length >= 2 ? "detail" : "subpage";
};

const Nav = ({ hasProjects = true, hasBlog = true }: NavProps) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const variant = variantFor(pathname);
  const navItems = NAV_ITEMS.filter(
    (item) => (item !== "Projects" || hasProjects) && (item !== "Blog" || hasBlog),
  );
  const anchorHref = (item: string) =>
    variant === "home" ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`;

  const brand = (
    <Link
      href="/"
      className="border-ink flex shrink-0 items-center border-r-4 no-underline"
    >
      <span className="font-anton bg-azure px-[clamp(12px,2vw,18px)] pt-[clamp(10px,1.5vw,14px)] pb-[clamp(8px,1.2vw,10px)] text-[clamp(22px,3.5vw,30px)] leading-none tracking-[1px] text-white">
        AR
      </span>
      <span className="font-anton text-ink px-[clamp(10px,2vw,18px)] text-[clamp(16px,2.5vw,24px)] tracking-[1px] whitespace-nowrap">
        AREYDRA
      </span>
    </Link>
  );

  if (variant === "detail") {
    const segment = pathname.split("/").filter(Boolean)[0] ?? "";
    const back = DETAIL_BACK[segment] ?? { href: "/", label: "← Back Home" };

    return (
      <nav
        aria-label="Primary"
        className="border-ink bg-paper sticky top-0 z-500 flex items-stretch justify-between border-b-4"
      >
        {brand}
        <Link
          href={back.href}
          className="border-ink bg-azure flex items-center border-l-4 px-[clamp(14px,2vw,24px)] text-[clamp(11px,1.2vw,13px)] font-bold tracking-[1px] whitespace-nowrap text-white uppercase no-underline"
        >
          {back.label}
        </Link>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Primary"
      className="border-ink bg-paper sticky top-0 z-500 flex items-stretch justify-between border-b-4"
    >
      {brand}

      {/* Visibility is a CSS decision: no viewport measurement, no hydration flash. */}
      <div className="hidden items-stretch overflow-x-auto md:flex">
        {navItems.map((item) => (
          <a
            key={item}
            href={anchorHref(item)}
            className="border-ink text-ink hover:bg-lime flex items-center border-l-2 px-[clamp(10px,1.5vw,20px)] text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] whitespace-nowrap uppercase no-underline transition-colors"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-stretch md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="font-anton border-ink bg-paper text-ink cursor-pointer border-l-4 px-[18px] text-[26px] leading-none"
        >
          <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <div
          id="nav-mobile-menu"
          className="border-ink bg-paper absolute top-full right-0 left-0 flex flex-col border-b-4 md:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item}
              href={anchorHref(item)}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "font-anton text-ink hover:bg-lime block px-6 py-[18px] text-[28px] uppercase no-underline transition-colors",
                "border-ink border-b-[3px] last:border-b-0",
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
