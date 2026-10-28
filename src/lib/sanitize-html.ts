import "server-only";

import sanitizeHtmlLib from "sanitize-html";

const ALLOWED_TAGS = ["p", "br", "strong", "em", "s", "ul", "ol", "li", "h3", "blockquote", "a", "img"];

/**
 * Sanitizes editor-produced HTML before it reaches `dangerouslySetInnerHTML`.
 * Runs on the server only: the allowlist is the security boundary, and the
 * client never needs the library.
 */
export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https"],
    // Anything not explicitly allowed is dropped, including event-handler
    // attributes and `javascript:` URLs.
    disallowedTagsMode: "discard",
  });
}
