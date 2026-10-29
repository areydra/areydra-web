"use client";

import RouteErrorFallback from "@/components/common/RouteErrorFallback";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      context="the blog"
    />
  );
}
