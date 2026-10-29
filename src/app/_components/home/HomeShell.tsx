"use client";

import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import StatusStrip from "@/components/layout/StatusStrip";
import { useClock } from "@/hooks/use-clock";

import type { ReactNode } from "react";

interface HomeShellProps {
  children: ReactNode;
  hasProjects?: boolean;
  hasBlog?: boolean;
}

/**
 * Chrome for the home route, which sits outside the `(site)` group because it
 * differs: this nav carries the collection toggles and this status strip carries
 * the live clock, while `(site)/layout.tsx` renders the subpage variants.
 */
const HomeShell = ({ children, hasProjects = true, hasBlog = true }: HomeShellProps) => {
  const clock = useClock();

  return (
    <div className="bg-paper min-h-screen">
      <StatusStrip right={clock} />
      <Nav
        hasProjects={hasProjects}
        hasBlog={hasBlog}
      />
      {children}
      <Footer />
    </div>
  );
};

export default HomeShell;
