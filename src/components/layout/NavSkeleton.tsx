import { NAV_ITEMS } from "@/constants/nav";
import { SkeletonBlock, SkeletonText } from "@/components/ui/Skeleton";

type NavSkeletonProps = {
  variant?: "home" | "subpage" | "detail";
};

/**
 * Static stand-in for the site nav inside route fallbacks. `Nav` is a client
 * component with a menu button and an invert toggle, and a skeleton must not
 * contain focusable elements — so the same box is reproduced here instead of
 * rendering the real nav. Brand glyphs and item labels are the real ones with
 * transparent ink, which is what keeps the nav height identical across the
 * swap (no jump above the fold).
 */
const NavSkeleton = ({ variant = "subpage" }: NavSkeletonProps) => {
  const brand = (
    <div className="border-ink flex shrink-0 items-center border-r-4">
      <span className="font-anton bg-azure px-[clamp(12px,2vw,18px)] pt-[clamp(10px,1.5vw,14px)] pb-[clamp(8px,1.2vw,10px)] text-[clamp(22px,3.5vw,30px)] leading-none tracking-[1px] text-white">
        AR
      </span>
      <span className="font-anton text-ink px-[clamp(10px,2vw,18px)] text-[clamp(16px,2.5vw,24px)] tracking-[1px] whitespace-nowrap">
        AREYDRA
      </span>
    </div>
  );

  return (
    <nav
      aria-hidden="true"
      className="border-ink bg-paper sticky top-0 z-500 flex items-stretch justify-between border-b-4"
    >
      {brand}

      {variant === "detail" ? (
        <div className="border-ink bg-azure flex items-center border-l-4 px-[clamp(14px,2vw,24px)] text-[clamp(11px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
          <SkeletonBlock className="h-3 w-24 rounded-sm" />
        </div>
      ) : (
        <>
          <div className="hidden items-stretch overflow-x-auto md:flex">
            {NAV_ITEMS.map((item) => (
              <div
                key={item}
                className="border-ink flex items-center border-l-2 px-[clamp(10px,1.5vw,20px)] text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase"
              >
                <SkeletonText as="span">{item}</SkeletonText>
              </div>
            ))}
          </div>

          <div className="flex items-stretch md:hidden">
            {variant === "home" && (
              <div className="border-ink bg-ink flex items-center border-l-4 px-3.5 text-[11px] font-bold tracking-[1px] uppercase">
                <SkeletonBlock className="h-2.5 w-7 rounded-sm" />
              </div>
            )}
            <div className="border-ink flex items-center border-l-4 px-[18px]">
              <SkeletonBlock className="h-4 w-5 rounded-sm" />
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavSkeleton;
