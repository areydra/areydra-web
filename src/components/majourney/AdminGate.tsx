"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAdminAuth } from "@/providers/majourney/AdminAuthProvider";
import { useAdminData } from "@/providers/majourney/AdminDataProvider";

import AdminHeader from "./AdminHeader";
import AdminLoadingSkeleton from "./AdminSkeletons";

const LOGIN_PATH = "/majourney/login";
const DEFAULT_PATH = "/majourney/profile";

const AdminGate = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, hydrated } = useAdminAuth();
  const isLoginPage = pathname === LOGIN_PATH;

  useEffect(
    function redirectOnAuthChange() {
      if (!hydrated) return;
      if (!loggedIn && !isLoginPage) router.replace(LOGIN_PATH);
      if (loggedIn && isLoginPage) router.replace(DEFAULT_PATH);
    },
    [hydrated, loggedIn, isLoginPage, router],
  );

  if (!hydrated) return null;
  if (isLoginPage) return <>{children}</>;
  if (!loggedIn) return null;

  return (
    <div className="min-h-screen bg-paper">
      <AdminHeader />
      <main id="main-content" className="mx-auto box-border max-w-270 p-8">
        <AdminContent pathname={pathname}>{children}</AdminContent>
      </main>
    </div>
  );
};

const AdminContent = ({ pathname, children }: { pathname: string; children: ReactNode }) => {
  const { loading } = useAdminData();

  // A load failure on one section (e.g. the profile singleton not existing yet
  // on a fresh database) must not block the rest of the panel — each page
  // surfaces its own section's error. Only an in-flight initial fetch gates
  // rendering here, and it shows the shape of the page it is about to render.
  if (loading) {
    return <AdminLoadingSkeleton pathname={pathname} />;
  }

  return <>{children}</>;
};

export default AdminGate;
