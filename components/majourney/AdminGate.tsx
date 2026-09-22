"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAdminAuth } from "@/contexts/majourney/AdminAuthContext";
import { useAdminData } from "@/contexts/majourney/AdminDataContext";
import AdminHeader from "./AdminHeader";

const LOGIN_PATH = "/majourney/login";
const DEFAULT_PATH = "/majourney/profile";

export default function AdminGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, hydrated } = useAdminAuth();
  const isLoginPage = pathname === LOGIN_PATH;

  useEffect(() => {
    if (!hydrated) return;
    if (!loggedIn && !isLoginPage) router.replace(LOGIN_PATH);
    if (loggedIn && isLoginPage) router.replace(DEFAULT_PATH);
  }, [hydrated, loggedIn, isLoginPage, router]);

  if (!hydrated) return null;
  if (isLoginPage) return <>{children}</>;
  if (!loggedIn) return null;

  return (
    <div className="min-h-screen bg-[#ebe7d9]">
      <AdminHeader />
      <main className="mx-auto box-border max-w-270 p-8">
        <AdminContent>{children}</AdminContent>
      </main>
    </div>
  );
}

function AdminContent({ children }: { children: ReactNode }) {
  const { loading } = useAdminData();

  // A load failure on one section (e.g. the profile singleton not existing
  // yet on a fresh database) must not block the rest of the admin panel —
  // each page surfaces its own section's error instead. Only the initial
  // fetch actually in flight gates rendering here.
  if (loading) {
    return <p className="text-sm font-semibold text-[#111]">Loading…</p>;
  }

  return <>{children}</>;
}
