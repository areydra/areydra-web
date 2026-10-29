import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import StatusStrip from "@/components/layout/StatusStrip";

import type { ReactNode } from "react";

/**
 * Public site shell. Chrome lives here so it is rendered once per segment
 * instead of remounting on every navigation — and so a `loading.tsx` only has
 * to replace page content, never the nav.
 *
 * The homepage is not in this group: it owns `HomeShell`, whose nav carries the
 * collection toggles and whose status strip carries the live clock.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-paper min-h-screen">
      <StatusStrip />
      <Nav />
      <main id="main-content">{children}</main>
      <Footer subpage />
    </div>
  );
}
