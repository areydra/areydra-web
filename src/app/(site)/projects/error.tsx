"use client";

import RouteErrorFallback from "@/components/common/RouteErrorFallback";

export default function ProjectsError({
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
      context="this project"
    />
  );
}
