"use client";

import { useEffect } from "react";

type RouteErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
  /** What the reader was trying to do, e.g. "the blog". */
  context: string;
};

/**
 * Shared body for the segment-level `error.tsx` boundaries, so a failed section
 * degrades to one panel instead of blanking the whole page.
 */
const RouteErrorFallback = ({ error, reset, context }: RouteErrorFallbackProps) => {
  useEffect(
    function reportError() {
      console.error(`failed to load ${context}`, error);
    },
    [error, context],
  );

  return (
    <main id="main-content" className="mx-auto flex max-w-3xl flex-col items-start gap-4 p-[clamp(24px,5vw,64px)]">
      <div role="alert" className="w-full border-[3px] border-ink bg-paper-soft p-[clamp(18px,2.5vw,28px)]">
        <p className="mb-2 text-xs font-bold tracking-[1px] text-danger-text uppercase">[ ERROR ]</p>
        <h1 className="font-anton m-0 mb-3 text-[clamp(24px,4vw,40px)] leading-[0.95] text-ink uppercase">
          Could not load {context}
        </h1>
        <p className="m-0 text-sm font-semibold text-ink">
          The request failed. Try again — if it keeps failing, the API may be down.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="cursor-pointer border-[3px] border-ink bg-lime px-5 py-3 text-[13px] font-bold tracking-[1px] text-ink uppercase"
      >
        Try again
      </button>
    </main>
  );
};

export default RouteErrorFallback;
