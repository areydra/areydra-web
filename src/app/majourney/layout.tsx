import type { ReactNode } from "react";
import AdminAuthProvider from "@/providers/majourney/AdminAuthProvider";
import AdminDataProvider from "@/providers/majourney/AdminDataProvider";
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
