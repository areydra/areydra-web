"use client";

import { memo, type ReactNode, useCallback, useState } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { StatusStrip } from "@/components/StatusStrip";
import { useWindowWidth } from "@/components/useWindowWidth";
import { useClock } from "./useClock";

type HomeShellProps = {
  children: ReactNode;
  hasProjects?: boolean;
  hasBlog?: boolean;
};

export const HomeShell = memo(function HomeShell({ children, hasProjects = true, hasBlog = true }: HomeShellProps) {
  const [invert, setInvert] = useState(false);
  const width = useWindowWidth();
  const clock = useClock();
  const isMobile = width < 640;
  const toggleInvert = useCallback(() => setInvert((value) => !value), []);

  return (
    <div
      className={`bg-[#ebe7d9] min-h-screen transition-[filter] duration-150 ${invert ? "[filter:invert(1)_hue-rotate(180deg)]" : "[filter:none]"}`}
    >
      <StatusStrip right={clock} />
      <Nav variant="home" isMobile={isMobile} showInvertToggle invert={invert} onToggleInvert={toggleInvert} hasProjects={hasProjects} hasBlog={hasBlog} />
      {children}
      <Footer />
    </div>
  );
});
