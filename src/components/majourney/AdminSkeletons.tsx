import { SkeletonBlock, SkeletonRegion, SkeletonText } from "@/components/ui/Skeleton";

const LABEL = "Loading the admin panel";

const SETTINGS_ROUTES = new Set(["/majourney/profile", "/majourney/home-config"]);

/**
 * The admin pages are client components behind one data provider, so the
 * skeleton hangs off the provider's `loading` flag rather than `loading.tsx`.
 * Which shape to show is decided by the route: settings forms, new/edit forms
 * and the card lists have different boxes, and a wrong shape reflows on swap.
 */
const AdminLoadingSkeleton = ({ pathname }: { pathname: string }) => {
  if (/\/(new|edit)$/.test(pathname)) return <AdminFormSkeleton />;
  if (SETTINGS_ROUTES.has(pathname)) return <AdminSettingsSkeleton />;
  return <AdminListSkeleton />;
};

const AdminListSkeleton = () => (
  <SkeletonRegion label={LABEL}>
    <div className="mb-4 flex justify-end">
      <div className="border-ink bg-lime border-[3px] px-4 py-2.5 text-[13px] font-bold shadow-[4px_4px_0_#111]">
        <SkeletonText as="span">+ Add item</SkeletonText>
      </div>
    </div>

    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      {[0, 1, 2].map((slot) => (
        <div
          key={slot}
          className="border-ink box-border overflow-hidden border-[3px] bg-white shadow-[6px_6px_0_#111]"
        >
          <SkeletonBlock className="h-20" />
          <div className="p-4">
            <div className="mb-1 text-[15px] font-extrabold">
              <SkeletonText as="div">Placeholder title</SkeletonText>
            </div>
            <div className="mb-2.5 text-xs">
              <SkeletonText as="div">/placeholder-slug</SkeletonText>
            </div>
            <div className="mb-3 flex flex-col text-sm leading-[1.5]">
              <SkeletonText as="div">Lorem ipsum dolor sit amet</SkeletonText>
              <SkeletonText
                as="div"
                className="w-11/12"
              >
                consectetur adipiscing elit
              </SkeletonText>
            </div>
            <div className="mb-3.5 flex flex-wrap gap-1.5">
              {["TypeScript", "React"].map((tech) => (
                <div
                  key={tech}
                  className="border-ink border-2 px-2.25 py-1 text-[11px] font-bold"
                >
                  <SkeletonText as="span">{tech}</SkeletonText>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="border-ink h-9.5 flex-1 border-[3px]" />
              <SkeletonBlock className="border-ink h-9.5 flex-1 border-[3px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </SkeletonRegion>
);

const AdminSettingsSkeleton = () => (
  <SkeletonRegion label={LABEL}>
    <div className="grid max-w-160 gap-5">
      <div className="border-ink box-border border-[3px] bg-white p-7 shadow-[6px_6px_0_#111]">
        <h2 className="m-0 mb-5 text-lg font-extrabold">
          <SkeletonText as="span">Profile</SkeletonText>
        </h2>
        <FieldSkeleton count={6} />
      </div>

      <div className="flex items-center gap-3">
        <SkeletonBlock className="border-ink h-11.5 w-36 border-[3px] shadow-[4px_4px_0_#111]" />
      </div>
    </div>
  </SkeletonRegion>
);

const AdminFormSkeleton = () => (
  <SkeletonRegion label={LABEL}>
    <div>
      <div className="mb-4 text-[13px] font-bold">
        <SkeletonText as="span">← Back to list</SkeletonText>
      </div>
      <h1 className="m-0 mb-5 text-[19px] font-extrabold">
        <SkeletonText as="span">Editing</SkeletonText>
      </h1>

      <div className="border-ink box-border border-[3px] bg-white p-7 shadow-[6px_6px_0_#111]">
        <FieldSkeleton count={5} />
      </div>

      <div className="mt-4 flex justify-end gap-2.5">
        <SkeletonBlock className="border-ink h-11 w-24 border-[3px]" />
        <SkeletonBlock className="border-ink h-11 w-24 border-[3px] shadow-[4px_4px_0_#111]" />
      </div>
    </div>
  </SkeletonRegion>
);

const FieldSkeleton = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="mb-3.5"
      >
        <div className="mb-1.5 block text-[13px] font-semibold">
          <SkeletonText as="span">Field label</SkeletonText>
        </div>
        <SkeletonBlock className="border-ink h-11.5 w-full border-[3px]" />
      </div>
    ))}
  </>
);

export default AdminLoadingSkeleton;
