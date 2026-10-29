import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BlogLoading from "@/app/(site)/blog/loading";
import BlogPostLoading from "@/app/(site)/blog/[slug]/loading";
import HomeLoading from "@/app/loading";
import AdminLoading from "@/app/majourney/loading";
import ProjectLoading from "@/app/(site)/projects/[slug]/loading";
import AdminLoadingSkeleton from "@/components/majourney/AdminSkeletons";

import type { ComponentType } from "react";

/**
 * The skeleton rules from the house convention that a reviewer would otherwise
 * have to check by eye: static fallbacks, no focusable content, reduced-motion
 * paired with every pulse, rounded text blocks, and one owner for the tokens.
 */
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const SKELETON_FILES = walk("src").filter((path) => /(?:Skeleton|loading)\.tsx$/.test(path));
const PRIMITIVES = join("src", "components", "ui", "Skeleton.tsx");

const loadingEntries: Array<[string, ComponentType]> = [
  ["/", HomeLoading],
  ["/blog", BlogLoading],
  ["/blog/[slug]", BlogPostLoading],
  ["/projects/[slug]", ProjectLoading],
  ["/majourney", AdminLoading],
];

describe("skeleton convention", () => {
  it("finds the skeleton files it is meant to police", () => {
    expect(SKELETON_FILES.length).toBeGreaterThanOrEqual(8);
  });

  it("keeps fallbacks server-rendered, static and element-free", () => {
    for (const path of SKELETON_FILES) {
      const source = readFileSync(path, "utf8");

      expect(source, `${path} must not opt into the client`).not.toMatch(/"use client"/);
      expect(source, `${path} must not render images or icons`).not.toMatch(/<img|<svg/);
      expect(source, `${path} must not render focusable controls`).not.toMatch(
        /<button|<a[\s>]|href=/,
      );
      expect(source, `${path} must be deterministic`).not.toMatch(/Math\.random|Date\.now/);
    }
  });

  it("defines the placeholder surface and motion in one place", () => {
    const owners = SKELETON_FILES.filter((path) =>
      /animate-pulse|bg-skeleton|text-transparent/.test(readFileSync(path, "utf8")),
    );

    expect(owners).toEqual([PRIMITIVES]);
  });
});

describe.each(loadingEntries)("%s loading fallback", (_route, Loading) => {
  it("is a single status region with nothing focusable inside", () => {
    const { container } = render(<Loading />);

    expect(container.querySelectorAll('[role="status"]')).toHaveLength(1);
    expect(
      container.querySelectorAll("a, button, input, textarea, select, [tabindex]"),
    ).toHaveLength(0);
  });

  it("pairs every pulse with the reduced-motion opt-out", () => {
    const { container } = render(<Loading />);
    const pulsing = Array.from(container.querySelectorAll('[class*="animate-pulse"]'));

    expect(pulsing.length).toBeGreaterThan(0);
    for (const block of pulsing) {
      expect(block).toHaveClass("motion-reduce:animate-none");
      expect(block).toHaveClass("bg-skeleton");
    }
  });

  it("never renders a square-cornered text block", () => {
    const { container } = render(<Loading />);
    const textBlocks = Array.from(container.querySelectorAll('[class*="text-transparent"]'));

    for (const block of textBlocks) {
      expect(block.className).toMatch(/\brounded/);
    }
  });
});

describe("admin loading skeleton", () => {
  it("shows the list shape on a collection route", () => {
    render(<AdminLoadingSkeleton pathname="/majourney/projects" />);

    expect(screen.getAllByText("Placeholder title")).toHaveLength(3);
  });

  it("shows the settings shape on a singleton route", () => {
    render(<AdminLoadingSkeleton pathname="/majourney/profile" />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.queryByText("Placeholder title")).not.toBeInTheDocument();
  });

  it("shows the editor frame on a new/edit route", () => {
    render(<AdminLoadingSkeleton pathname="/majourney/projects/new" />);

    expect(screen.getByText("Editing")).toBeInTheDocument();
    expect(screen.getByText("← Back to list")).toBeInTheDocument();
  });

  it("mounts no focusable content on the collection shape", () => {
    const { container } = render(<AdminLoadingSkeleton pathname="/majourney/blog" />);

    expect(
      container.querySelectorAll("a, button, input, textarea, select, [tabindex]"),
    ).toHaveLength(0);
    expect(container.querySelectorAll('[role="status"]')).toHaveLength(1);
  });
});
