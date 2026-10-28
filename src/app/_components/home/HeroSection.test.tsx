import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Profile } from "@/types/api.types";

import HeroSection from "./HeroSection";

const PROFILE: Profile = {
  id: 1,
  name: "Areydra Pratama",
  role: "Software Engineer",
  tagline: "Tagline.",
  avatarUrl: null,
  aboutTitle: "About",
  aboutDescription: "About copy.",
  aboutPoints: [],
  github: null,
  linkedin: null,
  email: null,
  phone: null,
  location: null,
  yearsOfExperience: 6,
  totalCompanies: 4,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const markChildren = (container: HTMLElement): HTMLElement[] => {
  const mark = container.querySelector(".home-hero__mark");
  if (!(mark instanceof HTMLElement)) throw new Error("expected the hero mark");

  const children = Array.from(mark.children);
  if (children.length === 0) throw new Error("expected content inside the hero mark");

  return children.filter((child): child is HTMLElement => child instanceof HTMLElement);
};

describe("HeroSection", () => {
  // The mark is sized by flex-grow + min-height. Anything in flow inside it
  // would feed its content height, so the hero would grow when the avatar
  // branch changes (photo vs initial letter) and shift everything below it.
  it("keeps the avatar out of layout", () => {
    const { container } = render(
      <HeroSection profile={{ ...PROFILE, avatarUrl: "https://assets.example/a.png" }} />,
    );

    for (const child of markChildren(container)) {
      expect(child).toHaveClass("absolute");
      expect(child).toHaveClass("h-full");
    }
  });

  it("keeps the initial-letter fallback out of layout too", () => {
    const { container } = render(<HeroSection profile={PROFILE} />);

    for (const child of markChildren(container)) {
      expect(child).toHaveClass("absolute");
    }
    expect(container.querySelector(".home-hero__mark span")?.textContent).toBe("A");
  });
});
