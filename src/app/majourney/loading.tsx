import { ADMIN_TABS } from "@/constants/nav";
import { SkeletonRegion, SkeletonText } from "@/components/ui/Skeleton";

/**
 * Pre-hydration fallback for the admin segment. The panel gates its own data
 * fetch behind `AdminGate`, which can only know the route once it mounts, so
 * this level mirrors the chrome and reserves the page — the content shape is
 * then chosen by the gate (settings, editor or list) instead of guessing twice.
 */
export default function AdminLoading() {
  return (
    <div className="bg-paper min-h-screen">
      <header
        aria-hidden="true"
        className="border-ink flex flex-wrap items-center justify-between gap-5 border-b-4 bg-white px-8 py-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="border-ink bg-azure h-8 w-8 shrink-0 border-[3px]" />
          <span className="text-ink text-base font-extrabold">Portfolio Admin</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ADMIN_TABS.map((tab) => (
            <div
              key={tab.href}
              className="text-ink border-[3px] border-transparent px-4 py-2.5 text-sm font-bold"
            >
              <SkeletonText as="span">{tab.label}</SkeletonText>
            </div>
          ))}
        </div>
        <div className="border-ink text-ink border-[3px] bg-white px-4 py-2.25 text-[13px] font-bold">
          <SkeletonText as="span">Log out</SkeletonText>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto box-border max-w-270 p-8"
      >
        <SkeletonRegion label="Loading the admin panel" />
      </main>
    </div>
  );
}
