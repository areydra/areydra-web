import DOMPurify from "isomorphic-dompurify";

// Matches the constrained Tiptap toolbar in RichTextEditor — the editor
// itself can't produce anything outside this set, but we still sanitize at
// every render site (not just at save time), since description is rendered
// to anonymous public visitors and the API could be written to directly,
// bypassing the editor's own constraints.
const ALLOWED_TAGS = ["p", "br", "strong", "em", "s", "ul", "ol", "li", "h3", "blockquote", "a", "img"];
const ALLOWED_ATTR = ["href", "src", "alt"];

/** Sanitizes rich-text HTML before rendering it with dangerouslySetInnerHTML. */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^https?:\/\//i,
  });
}

/**
 * Strips all HTML tags for plain-text previews (e.g. the admin list card's
 * line-clamped excerpt). Inserts a space after block-level tags first so
 * "<p>Hello</p><p>World</p>" becomes "Hello World" rather than "HelloWorld".
 */
export function stripHtmlToText(html: string): string {
  const withBreaks = html.replace(/<\/(p|li|h3|blockquote)>/gi, "$& ").replace(/<br\s*\/?>/gi, " ");
  const text = DOMPurify.sanitize(withBreaks, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return text.replace(/\s+/g, " ").trim();
}
