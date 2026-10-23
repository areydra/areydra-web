import type { ReactNode } from "react";
import { AdminAuthProvider } from "@/contexts/majourney/AdminAuthContext";
import { AdminDataProvider } from "@/contexts/majourney/AdminDataContext";
import AdminGate from "@/components/majourney/AdminGate";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`font-(family-name:--font-space-grotesk)`}>
      <AdminAuthProvider>
        <AdminDataProvider>
          <AdminGate>{children}</AdminGate>
        </AdminDataProvider>
      </AdminAuthProvider>
    </div>
  );
}
