"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ADMIN_TABS as TABS } from "@/constants/nav";
import { cn } from "@/lib/cn";
import { useAdminAuth } from "@/providers/majourney/AdminAuthProvider";

const AdminHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    // Clearing the cookie is a server round-trip; navigate only after it lands
    // so the gate does not bounce the user straight back in.
    await logout();
    router.push("/majourney/login");
  };

  return (
    <header className="border-ink flex flex-wrap items-center justify-between gap-5 border-b-4 bg-white px-8 py-4">
      <div className="flex items-center gap-2.5">
        <div
          aria-hidden="true"
          className="border-ink bg-azure h-8 w-8 shrink-0 border-[3px]"
        />
        <span className="text-ink text-base font-extrabold">Portfolio Admin</span>
      </div>
      <nav
        aria-label="Admin sections"
        className="flex flex-wrap gap-1.5"
      >
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "text-ink border-[3px] px-4 py-2.5 text-sm font-bold",
                isActive ? "border-ink bg-lime" : "border-transparent bg-transparent",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="border-ink text-ink cursor-pointer border-[3px] bg-white px-4 py-2.25 text-[13px] font-bold"
      >
        Log out
      </button>
    </header>
  );
};

export default AdminHeader;
