"use client";

import Link from "next/link";
import { useEffect } from "react";

import Footer from "@/components/layout/Footer";

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(
    function reportError() {
      // Server-side logging keeps the stack trace; this records the client hit.
      console.error("route error", error);
    },
    [error],
  );

  return (
    <div className="bg-paper flex min-h-screen flex-col">
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center gap-4 p-8"
      >
        <p className="text-azure text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
          [ ERROR ]
        </p>
        <h1 className="font-anton text-ink m-0 text-center text-[clamp(32px,6vw,64px)] leading-[0.9] uppercase">
          Something went wrong.
        </h1>
        <p className="text-ink max-w-[46ch] text-center text-sm font-semibold">
          The page could not be loaded. Try again, or head back home.
        </p>
        <div className="border-ink flex flex-wrap border-[3px]">
          <button
            type="button"
            onClick={reset}
            className="bg-azure cursor-pointer px-5 py-3 text-[13px] font-bold tracking-[1px] text-white uppercase"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border-ink bg-paper text-ink border-l-[3px] px-5 py-3 text-[13px] font-bold tracking-[1px] uppercase no-underline"
          >
            Back home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
