import { describe, expect, it } from "vitest";

import { formatCount, formatPostDate, formatProjectDate, formatWorkPeriod, initials } from "./format";

describe("formatCount", () => {
  it("treats null/undefined as zero", () => {
    expect(formatCount(null)).toBe("0");
    expect(formatCount(undefined, "+")).toBe("0+");
  });

  it("clamps negative values and appends the suffix", () => {
    expect(formatCount(-4)).toBe("0");
    expect(formatCount(7, "+")).toBe("7+");
  });
});

describe("formatWorkPeriod", () => {
  it("renders an open-ended period as Present", () => {
    expect(formatWorkPeriod(3, 2021, null, null)).toBe("Mar 2021 - Present");
  });

  it("renders a closed period", () => {
    expect(formatWorkPeriod(1, 2020, 12, 2022)).toBe("Jan 2020 - Dec 2022");
  });

  it("falls back to the year when the month is invalid", () => {
    expect(formatWorkPeriod(0, 2020, 13, 2022)).toBe("2020 - 2022");
  });
});

describe("formatPostDate", () => {
  it("labels a missing or malformed date as Draft", () => {
    expect(formatPostDate(null)).toBe("Draft");
    expect(formatPostDate("not-a-date")).toBe("Draft");
  });

  it("formats an ISO date", () => {
    expect(formatPostDate("2026-03-09T10:00:00.000Z")).toBe("Mar 2026");
  });
});

describe("formatProjectDate", () => {
  it("passes through values it cannot parse", () => {
    expect(formatProjectDate("someday")).toBe("someday");
  });

  it("formats a valid date", () => {
    expect(formatProjectDate("2025-11-02T00:00:00.000Z")).toBe("Nov 2025");
  });
});

describe("initials", () => {
  it("takes at most two initials", () => {
    expect(initials("Ada Lovelace Byron")).toBe("AL");
  });

  it("returns an empty string for blank input", () => {
    expect(initials("   ")).toBe("");
  });
});
