"use client";

import RouteErrorFallback from "@/components/common/RouteErrorFallback";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteErrorFallback error={error} reset={reset} context="the admin panel" />;
}
