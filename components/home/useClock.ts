"use client";

import { useEffect, useState } from "react";

export function useClock() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const date = new Date();
      const pad = (value: number) => String(value).padStart(2, "0");
      setClock(`${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`);
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return clock;
}
