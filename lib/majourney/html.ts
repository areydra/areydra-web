import sanitizeHtmlLib from "sanitize-html";

const ALLOWED_TAGS = ["p", "br", "strong", "em", "s", "ul", "ol", "li", "h3", "blockquote", "a", "img"];
const ALLOWED_ATTR = ["href", "src", "alt"];

export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      'a': ['href'],
      'img': ['src', 'alt'],
    },
    allowedSchemes: ['http', 'https'],
  });
}

export function stripHtmlToText(html: string): string {
  const withBreaks = html.replace(/<\/(p|li|h3|blockquote)>/gi, "$& ").replace(/<br\s*\/?>/gi, " ");
  const text = sanitizeHtmlLib(withBreaks, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return text.replace(/\s+/g, " ").trim();
}