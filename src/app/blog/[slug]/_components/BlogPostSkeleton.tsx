import StatusStrip from "@/components/layout/StatusStrip";
import NavSkeleton from "@/components/layout/NavSkeleton";
import { SkeletonBlock, SkeletonRegion, SkeletonText } from "@/components/ui/Skeleton";

/**
 * Stands in for `BlogPostPage` while `/blog/[slug]` loads. Mirrors the azure
 * header, the 4xl reading column, the thumbnail box and the closing aside.
 */
const BlogPostSkeleton = () => {
  return (
    <div className="bg-paper min-h-screen">
      <StatusStrip />
      <NavSkeleton variant="detail" />

      <main id="main-content">
        <SkeletonRegion label="Loading the post">
          <article>
            <header className="border-ink bg-azure border-b-4 px-[clamp(24px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
              <div className="mb-4 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
                <SkeletonText as="span">ARTICLE</SkeletonText>
              </div>
              <h1 className="mb-6 text-[clamp(30px,6vw,80px)] leading-[0.95] font-black tracking-[-1px] uppercase">
                <SkeletonText as="span">A placeholder post headline</SkeletonText>
              </h1>
              <div className="mb-4 flex flex-wrap gap-2">
                {["Engineering", "Next.js"].map((tag) => (
                  <div
                    key={tag}
                    className="border-ink bg-paper border-2 px-2.5 py-1 text-[11px] font-bold tracking-[1px] uppercase"
                  >
                    <SkeletonText as="span">{tag}</SkeletonText>
                  </div>
                ))}
              </div>
              <p className="text-[13px] font-bold tracking-[1px] uppercase">
                <SkeletonText as="span">Jan 01, 2026 · 5 min · By Areydra</SkeletonText>
              </p>
            </header>

            <div className="mx-auto max-w-4xl px-[clamp(28px,5vw,64px)] py-[clamp(28px,5vw,64px)]">
              <SkeletonBlock className="border-ink mb-8 aspect-[1200/630] w-full border-[3px] shadow-[7px_7px_0_#0a0a0a]" />

              <div className="flex flex-col gap-3 text-[clamp(15px,1.6vw,17px)] leading-[1.8] font-medium">
                <SkeletonText as="div">Lorem ipsum dolor sit amet, consectetur adipiscing</SkeletonText>
                <SkeletonText as="div" className="w-11/12">
                  elit sed do eiusmod tempor incididunt ut labore
                </SkeletonText>
                <SkeletonText as="div" className="w-full">
                  et dolore magna aliqua ut enim ad minim veniam
                </SkeletonText>
                <SkeletonText as="div" className="w-10/12">
                  quis nostrud exercitation ullamco laboris nisi
                </SkeletonText>
                <SkeletonText as="div" className="w-9/12">
                  ut aliquip ex ea commodo consequat
                </SkeletonText>
              </div>

              <aside className="border-ink bg-lime mt-10 border-[3px] p-[clamp(20px,3vw,32px)] shadow-[8px_8px_0_#111]">
                <h2 className="mb-2.5 text-2xl font-black tracking-[-0.5px] uppercase">
                  <SkeletonText as="span">Enjoyed this?</SkeletonText>
                </h2>
                <div className="mb-4 flex flex-col gap-1 text-sm font-semibold">
                  <SkeletonText as="div">Read more on the blog, or reach out</SkeletonText>
                  <SkeletonText as="div" className="w-2/3">
                    to talk shop.
                  </SkeletonText>
                </div>
                <div className="border-ink flex w-fit flex-wrap border-[3px]">
                  <div className="bg-azure px-5 py-3 text-[13px] font-bold tracking-[1px] uppercase">
                    <SkeletonText as="span">More Posts</SkeletonText>
                  </div>
                  <div className="border-ink bg-paper border-l-[3px] px-5 py-3 text-[13px] font-bold tracking-[1px] uppercase">
                    <SkeletonText as="span">Get in Touch</SkeletonText>
                  </div>
                </div>
              </aside>
            </div>
          </article>
        </SkeletonRegion>
      </main>
    </div>
  );
};

export default BlogPostSkeleton;
