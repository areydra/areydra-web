/**
 * Navigation labels shared by the live nav and its loading skeleton. Kept out
 * of the `"use client"` components so a server-rendered fallback can use the
 * same labels and produce the same box widths.
 */
export const NAV_ITEMS = ["About", "Skills", "Work", "Projects", "Blog", "Contact"] as const;

export const ADMIN_TABS = [
  { href: "/majourney/profile", label: "Profile" },
  { href: "/majourney/skills", label: "Skills" },
  { href: "/majourney/work-history", label: "Work History" },
  { href: "/majourney/projects", label: "Projects" },
  { href: "/majourney/blog", label: "Blog" },
  { href: "/majourney/home-config", label: "Home Config" },
] as const;
