"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/cn";
import { useAdminAuth } from "@/providers/majourney/AdminAuthProvider";

const TABS = [
  { href: "/majourney/profile", label: "Profile" },
  { href: "/majourney/skills", label: "Skills" },
  { href: "/majourney/work-history", label: "Work History" },
  { href: "/majourney/projects", label: "Projects" },
  { href: "/majourney/blog", label: "Blog" },
  { href: "/majourney/home-config", label: "Home Config" },
];

const AdminHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    router.push("/majourney/login");
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-5 border-b-4 border-ink bg-white px-8 py-4">
      <div className="flex items-center gap-2.5">
        <div aria-hidden="true" className="h-8 w-8 shrink-0 border-[3px] border-ink bg-azure" />
        <span className="text-base font-extrabold text-ink">Portfolio Admin</span>
      </div>
      <nav aria-label="Admin sections" className="flex flex-wrap gap-1.5">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "border-[3px] px-4 py-2.5 text-sm font-bold text-ink",
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
        className="cursor-pointer border-[3px] border-ink bg-white px-4 py-2.25 text-[13px] font-bold text-ink"
      >
        Log out
      </button>
    </header>
  );
};

export default AdminHeader;
