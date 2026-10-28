export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="min-h-screen bg-paper">
      <span className="sr-only">Loading page…</span>
      <div className="h-14 animate-pulse border-b-4 border-ink bg-paper-soft" />
      <div className="mx-auto max-w-3xl space-y-4 p-[clamp(24px,5vw,64px)]">
        <div className="h-24 animate-pulse border-[3px] border-ink bg-paper-soft" />
        <div className="h-4 w-2/3 animate-pulse bg-paper-soft" />
        <div className="h-4 w-1/2 animate-pulse bg-paper-soft" />
      </div>
    </div>
  );
}
