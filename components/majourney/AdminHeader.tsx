"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/majourney/AdminAuthContext";

const TABS = [
  { href: "/majourney/profile", label: "Profile" },
  { href: "/majourney/skills", label: "Skills" },
  { href: "/majourney/work-history", label: "Work History" },
  { href: "/majourney/projects", label: "Projects" },
  { href: "/majourney/blog", label: "Blog" },
  { href: "/majourney/home-config", label: "Home Config" },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    router.push("/majourney/login");
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-5 border-b-4 border-[#111] bg-white px-8 py-4">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 shrink-0 border-[3px] border-[#111] bg-[#1410ff]" />
        <span className="text-base font-extrabold text-[#111]">Portfolio Admin</span>
      </div>
      <nav className="flex flex-wrap gap-1.5">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2.5 text-sm font-bold text-[#111] border-[3px] ${
                active ? "border-[#111] bg-[#c8ff00]" : "border-transparent bg-transparent"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="cursor-pointer border-[3px] border-[#111] bg-white px-4 py-2.25 text-[13px] font-bold text-[#111]"
      >
        Log out
      </button>
    </header>
  );
}
