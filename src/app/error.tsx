"use client";

import Link from "next/link";
import { useEffect } from "react";

import Footer from "@/components/layout/Footer";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(
    function reportError() {
      // Server-side logging keeps the stack trace; this records the client hit.
      console.error("route error", error);
    },
    [error],
  );

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <main id="main-content" className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] text-azure uppercase">[ ERROR ]</p>
        <h1 className="font-anton m-0 text-center text-[clamp(32px,6vw,64px)] leading-[0.9] text-ink uppercase">
          Something went wrong.
        </h1>
        <p className="max-w-[46ch] text-center text-sm font-semibold text-ink">
          The page could not be loaded. Try again, or head back home.
        </p>
        <div className="flex flex-wrap border-[3px] border-ink">
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer bg-azure px-5 py-3 text-[13px] font-bold tracking-[1px] text-white uppercase"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border-l-[3px] border-ink bg-paper px-5 py-3 text-[13px] font-bold tracking-[1px] text-ink uppercase no-underline"
          >
            Back home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
