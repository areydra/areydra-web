import { describe, expect, it } from "vitest";

import { stripHtmlToText } from "./strip-html";

describe("stripHtmlToText", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtmlToText("<p>Hello   <strong>world</strong></p>")).toBe("Hello world");
  });

  it("turns block boundaries and line breaks into spaces", () => {
    expect(stripHtmlToText("<p>one</p><p>two</p>three<br />four")).toBe("one two three four");
  });

  it("decodes the entities editors emit", () => {
    expect(stripHtmlToText("<p>a &amp; b &lt;tag&gt; &quot;q&quot; &#39;s&#39;</p>")).toBe(
      "a & b <tag> \"q\" 's'",
    );
  });

  it("keeps unknown entities untouched instead of dropping them", () => {
    expect(stripHtmlToText("<p>100&euro;</p>")).toBe("100&euro;");
  });

  it("returns an empty string for empty input", () => {
    expect(stripHtmlToText("")).toBe("");
    expect(stripHtmlToText("<p></p>")).toBe("");
  });
});
