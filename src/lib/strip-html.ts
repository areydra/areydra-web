const BLOCK_END = /<\/(?:p|li|h[1-6]|blockquote|div|tr)>/gi;
const LINE_BREAK = /<br\s*\/?>/gi;
const TAG = /<[^>]*>/g;

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

/**
 * Extracts plain text from editor-produced HTML for previews and cards.
 *
 * This runs on the client (admin list cards), so it must not pull a sanitizer
 * into the bundle: it strips tags with a regex and decodes the handful of
 * entities those editors emit. It is a preview helper, never an XSS boundary —
 * anything that reaches `dangerouslySetInnerHTML` goes through
 * `lib/sanitize-html.ts` on the server instead.
 */
export function stripHtmlToText(html: string): string {
  return html
    .replace(LINE_BREAK, " ")
    .replace(BLOCK_END, "$& ")
    .replace(TAG, "")
    .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity)
    .replace(/\s+/g, " ")
    .trim();
}
