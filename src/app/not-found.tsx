import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Nav variant="subpage" />
      <main id="main-content" className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] text-azure uppercase">[ 404 ]</p>
        <h1 className="font-anton m-0 text-center text-[clamp(40px,9vw,120px)] leading-[0.85] text-ink uppercase">
          Page not found
        </h1>
        <p className="max-w-[46ch] text-center text-sm font-semibold text-ink">
          That page does not exist, or it was moved.
        </p>
        <Link
          href="/"
          className="border-[3px] border-ink bg-azure px-5 py-3 text-[13px] font-bold tracking-[1px] text-white uppercase no-underline"
        >
          Back home
        </Link>
      </main>
      <Footer subpage />
    </div>
  );
}
