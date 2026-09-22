"use client";

import { memo, type ReactNode, useCallback, useState } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { StatusStrip } from "@/components/StatusStrip";
import { useWindowWidth } from "@/components/useWindowWidth";
import { useClock } from "./useClock";

type HomeShellProps = {
  children: ReactNode;
};

export const HomeShell = memo(function HomeShell({ children }: HomeShellProps) {
  const [invert, setInvert] = useState(false);
  const width = useWindowWidth();
  const clock = useClock();
  const isMobile = width < 640;
  const toggleInvert = useCallback(() => setInvert((value) => !value), []);

  return (
    <div
      style={{
        background: "#ebe7d9",
        minHeight: "100vh",
        filter: invert ? "invert(1) hue-rotate(180deg)" : "none",
        transition: "filter 0.15s",
      }}
    >
      <StatusStrip right={clock} />
      <Nav variant="home" isMobile={isMobile} showInvertToggle invert={invert} onToggleInvert={toggleInvert} />
      {children}
      <Footer />
    </div>
  );
});
