import { SkeletonBlock, SkeletonRegion, SkeletonText } from "@/components/ui/Skeleton";

const CARD_COUNT = 6;
const TAG_SLOTS = ["All", "Engineering", "Design"];

/**
 * Stands in for `BlogListPage` while `/blog` loads. Box for box: same header
 * section, same tag row, same 1/2/3-column card grid, same card internals —
 * see the real component before changing either one.
 */
const BlogListSkeleton = () => {
  return (
    <>
      <SkeletonRegion label="Loading the blog">
        <section className="border-ink border-b-4 px-[clamp(24px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
          <SkeletonBlock className="mb-5 h-3 w-28 rounded-sm" />
          <div className="mb-3 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[2px] uppercase">
            <SkeletonText as="span">[ WRITING ]</SkeletonText>
          </div>
          <h1 className="mb-5 text-[clamp(44px,8vw,120px)] leading-[0.85] font-black tracking-[-1px] uppercase">
            <SkeletonText as="span">The Blog</SkeletonText>
          </h1>
          <div className="flex flex-wrap gap-2">
            {TAG_SLOTS.map((tag) => (
              <div
                key={tag}
                className="border-ink border-2 px-4 py-2 text-xs font-bold tracking-[1px] uppercase"
              >
                <SkeletonText as="span">{tag}</SkeletonText>
              </div>
            ))}
          </div>
        </section>

        <section className="p-[clamp(24px,5vw,64px)]">
          <div className="grid grid-cols-1 gap-[clamp(14px,2vw,22px)] sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: CARD_COUNT }).map((_, index) => (
              <div
                key={index}
                className="border-ink flex flex-col border-[3px] bg-white shadow-[6px_6px_0_var(--color-ink-deep)]"
              >
                <SkeletonBlock className="border-ink h-[clamp(90px,10vw,130px)] border-b-[3px]" />
                <div className="flex flex-1 flex-col p-[clamp(16px,2vw,22px)]">
                  <div className="mb-3.5 flex flex-wrap gap-1">
                    <div className="border-ink border-2 px-1.5 py-0.5 text-[clamp(9px,1vw,11px)] font-bold tracking-[1px] uppercase">
                      <SkeletonText as="span">Engineering</SkeletonText>
                    </div>
                    <div className="border-ink border-2 px-1.5 py-0.5 text-[clamp(9px,1vw,11px)] font-bold tracking-[1px] uppercase">
                      <SkeletonText as="span">Notes</SkeletonText>
                    </div>
                  </div>
                  <div className="mb-2.5 flex flex-col gap-1 text-[clamp(16px,1.8vw,20px)] leading-[1.25] font-extrabold">
                    <SkeletonText as="div">A placeholder post title that wraps</SkeletonText>
                    <SkeletonText
                      as="div"
                      className="w-2/3"
                    >
                      onto a second line
                    </SkeletonText>
                  </div>
                  <div className="text-sm leading-[1.6] font-medium">
                    <SkeletonText as="div">Lorem ipsum dolor sit amet</SkeletonText>
                    <SkeletonText
                      as="div"
                      className="w-11/12"
                    >
                      consectetur adipiscing elit, sed
                    </SkeletonText>
                    <SkeletonText
                      as="div"
                      className="w-3/4"
                    >
                      do eiusmod tempor
                    </SkeletonText>
                  </div>
                  <div className="border-ink mt-4 border-t-2 pt-2.5 text-[clamp(10px,1.1vw,12px)] font-bold tracking-[1px] uppercase">
                    <SkeletonText as="span">Jan 01, 2026 · 5 min</SkeletonText>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </SkeletonRegion>
    </>
  );
};

export default BlogListSkeleton;
