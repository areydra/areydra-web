type RouteLoadingProps = {
  /** Announced to assistive tech, e.g. "Loading the blog". */
  label: string;
};

const RouteLoading = ({ label }: RouteLoadingProps) => {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-3xl space-y-4 p-[clamp(24px,5vw,64px)]">
      <span className="sr-only">{label}…</span>
      <div aria-hidden="true" className="space-y-3">
        <div className="h-8 w-1/3 animate-pulse bg-paper-soft" />
        <div className="h-4 w-2/3 animate-pulse bg-paper-soft" />
        <div className="h-4 w-1/2 animate-pulse bg-paper-soft" />
      </div>
    </div>
  );
};

export default RouteLoading;
