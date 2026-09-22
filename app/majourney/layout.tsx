import type { ReactNode } from "react";
import { spaceGrotesk } from "./fonts";
import { AdminAuthProvider } from "@/contexts/majourney/AdminAuthContext";
import { AdminDataProvider } from "@/contexts/majourney/AdminDataContext";
import AdminGate from "@/components/majourney/AdminGate";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${spaceGrotesk.variable} font-[family-name:var(--font-space-grotesk)]`}>
      <AdminAuthProvider>
        <AdminDataProvider>
          <AdminGate>{children}</AdminGate>
        </AdminDataProvider>
      </AdminAuthProvider>
    </div>
  );
}
