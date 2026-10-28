import { describe, expect, it } from "vitest";

import { safeExternalUrl, toMailtoHref, toTelHref } from "./safe-url";

describe("safeExternalUrl", () => {
  it("keeps http and https URLs", () => {
    expect(safeExternalUrl("https://example.com/a?b=1")).toBe("https://example.com/a?b=1");
    expect(safeExternalUrl("http://example.com")).toBe("http://example.com/");
  });

  it("rejects script-bearing URLs", () => {
    expect(safeExternalUrl("javascript:alert(1)")).toBeNull();
    expect(safeExternalUrl("  javascript:alert(1)  ")).toBeNull();
    expect(safeExternalUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(safeExternalUrl("vbscript:msgbox(1)")).toBeNull();
  });

  it("rejects empty, relative, and malformed values", () => {
    expect(safeExternalUrl(null)).toBeNull();
    expect(safeExternalUrl(undefined)).toBeNull();
    expect(safeExternalUrl("")).toBeNull();
    expect(safeExternalUrl("/relative/path")).toBeNull();
    expect(safeExternalUrl("not a url")).toBeNull();
  });
});

describe("toTelHref", () => {
  it("strips everything but digits and a leading plus", () => {
    expect(toTelHref("+62 (812) 3456-7890")).toBe("tel:+6281234567890");
  });

  it("returns null when nothing usable remains", () => {
    expect(toTelHref(null)).toBeNull();
    expect(toTelHref("call me")).toBeNull();
  });
});

describe("toMailtoHref", () => {
  it("accepts a plain email address", () => {
    expect(toMailtoHref("a@b.co")).toBe("mailto:a@b.co");
  });

  it("rejects header-injection attempts and non-emails", () => {
    expect(toMailtoHref("a@b.co\nBcc: victim@example.com")).toBeNull();
    expect(toMailtoHref("hello")).toBeNull();
    expect(toMailtoHref(null)).toBeNull();
  });
});
