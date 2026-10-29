import { cn } from "@/lib/cn";

import type { ReactNode } from "react";

/**
 * The one pulse definition in the codebase. Keeping it here is what makes the
 * `prefers-reduced-motion` pairing impossible to forget at a call site.
 */
const PULSE = "animate-pulse motion-reduce:animate-none";

interface SkeletonRegionProps {
  /** Announced to assistive tech, e.g. "Loading the blog". */
  label: string;
  className?: string;
  children?: ReactNode;
}

/**
 * Root of a loading region. It is a status region so the wait is announced
 * once; everything visual lives under `aria-hidden`, so placeholder text is
 * never read out as page content.
 */
export function SkeletonRegion({ label, className, children }: SkeletonRegionProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">{label}</span>
      <div
        aria-hidden="true"
        className={className}
      >
        {children}
      </div>
    </div>
  );
}

interface SkeletonBlockProps {
  /** Size and radius mirroring the real element, e.g. `h-20 rounded-md`. */
  className?: string;
}

/**
 * A non-text shape: an image slot, an icon, a chip or a button. Size and radius
 * come from the caller and must match the element it stands in for.
 */
export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return <div className={cn(PULSE, "bg-skeleton", className)} />;
}

type SkeletonTextTag = "p" | "span" | "div" | "h1" | "h2" | "h3";

interface SkeletonTextProps {
  as?: SkeletonTextTag;
  className?: string;
  children: ReactNode;
}

/**
 * A line of text at its real metrics: the caller passes the same typography
 * classes as the real element, so the box height and wrapping match and the
 * swap costs no layout shift. The ink is simply transparent.
 */
export function SkeletonText({ as = "p", className, children }: SkeletonTextProps) {
  const Tag = as;

  return (
    <Tag className={cn(PULSE, "bg-skeleton w-fit rounded text-transparent", className)}>
      {children}
    </Tag>
  );
}
