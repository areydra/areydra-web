"use client";

import { useState, type ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import StatusStrip from "@/components/layout/StatusStrip";
import { useClock } from "@/hooks/use-clock";

interface HomeShellProps {
  children: ReactNode;
  hasProjects?: boolean;
  hasBlog?: boolean;
}

const HomeShell = ({ children, hasProjects = true, hasBlog = true }: HomeShellProps) => {
  const [invert, setInvert] = useState(false);
  const clock = useClock();

  return (
    <div
      className={
        invert
          ? "bg-paper min-h-screen [filter:invert(1)_hue-rotate(180deg)] transition-[filter] duration-150"
          : "bg-paper min-h-screen [filter:none] transition-[filter] duration-150"
      }
    >
      <StatusStrip right={clock} />
      <Nav
        showInvertToggle
        invert={invert}
        onToggleInvert={() => setInvert((value) => !value)}
        hasProjects={hasProjects}
        hasBlog={hasBlog}
      />
      {children}
      <Footer />
    </div>
  );
};

export default HomeShell;
