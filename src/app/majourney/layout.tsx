import AdminGate from "@/components/majourney/AdminGate";
import AdminAuthProvider from "@/providers/majourney/AdminAuthProvider";
import AdminDataProvider from "@/providers/majourney/AdminDataProvider";
import { getAdminInitialData } from "@/services/admin-data.server";

import type { ReactNode } from "react";
import type { Metadata } from "next";

/**
 * The nonce-based CSP is per request, so its pages cannot be prerendered: a
 * static HTML shell would ship inline scripts without the nonce and the browser
 * would block every one of them. The admin panel is authenticated and
 * client-rendered — caching its shell buys nothing — so render it per request.
 */
export const dynamic = "force-dynamic";

/** Private area: never indexed, and absent from the generated sitemap. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Data is fetched here, on the server, and handed to the client provider as
 * initial state: the panel paints with content instead of a skeleton, and the
 * browser makes no data requests. Mutations stay Server Actions.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const initialData = await getAdminInitialData();

  return (
    <div className={`font-(family-name:--font-space-grotesk)`}>
      <AdminAuthProvider>
        <AdminDataProvider initialData={initialData}>
          <AdminGate>{children}</AdminGate>
        </AdminDataProvider>
      </AdminAuthProvider>
    </div>
  );
}
