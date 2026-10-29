import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkeletonBlock, SkeletonRegion, SkeletonText } from "./Skeleton";

const asElement = (value: Element | null): HTMLElement => {
  if (!(value instanceof HTMLElement)) throw new Error("expected an element");
  return value;
};

describe("Skeleton", () => {
  it("announces the wait once and hides the placeholder shapes", () => {
    render(
      <SkeletonRegion label="Loading the blog">
        <SkeletonText>Placeholder</SkeletonText>
      </SkeletonRegion>,
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Loading the blog")).toHaveClass("sr-only");

    const placeholder = screen.getByText("Placeholder");
    expect(placeholder.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("carries the pulse and the reduced-motion opt-out from one definition", () => {
    const { container } = render(<SkeletonBlock className="h-4 w-10" />);
    const block = asElement(container.firstElementChild);

    expect(block).toHaveClass(
      "bg-skeleton",
      "animate-pulse",
      "motion-reduce:animate-none",
      "h-4",
      "w-10",
    );
  });

  it("keeps the caller's typography so text boxes match the real component", () => {
    const { container } = render(
      <SkeletonText
        as="h2"
        className="text-lg font-extrabold"
      >
        Placeholder title
      </SkeletonText>,
    );
    const heading = asElement(container.firstElementChild);

    expect(heading.tagName).toBe("H2");
    expect(heading).toHaveTextContent("Placeholder title");
    expect(heading).toHaveClass(
      "text-lg",
      "font-extrabold",
      "rounded",
      "w-fit",
      "bg-skeleton",
      "text-transparent",
      "animate-pulse",
      "motion-reduce:animate-none",
    );
  });

  it("lets the caller widen a text line without losing the radius", () => {
    const { container } = render(
      <SkeletonText
        as="div"
        className="w-2/3"
      >
        Shorter line
      </SkeletonText>,
    );

    expect(asElement(container.firstElementChild)).toHaveClass("w-2/3", "rounded");
  });
});
