import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";

/**
 * Rendered per request for the same reason as the admin segment: the nonce CSP
 * only works on HTML rendered per request, and a prerendered 404 would block
 * every inline script it ships.
 */
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="bg-paper flex min-h-screen flex-col">
      <Nav />
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center gap-4 p-8"
      >
        <p className="text-azure text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
          [ 404 ]
        </p>
        <h1 className="font-anton text-ink m-0 text-center text-[clamp(40px,9vw,120px)] leading-[0.85] uppercase">
          Page not found
        </h1>
        <p className="text-ink max-w-[46ch] text-center text-sm font-semibold">
          That page does not exist, or it was moved.
        </p>
        <Link
          href="/"
          className="border-ink bg-azure border-[3px] px-5 py-3 text-[13px] font-bold tracking-[1px] text-white uppercase no-underline"
        >
          Back home
        </Link>
      </main>
      <Footer subpage />
    </div>
  );
}
