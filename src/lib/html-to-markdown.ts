import "server-only";

import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

/**
 * Rows written by the pre-markdown rich-text editor (tiptap wrote `<p>`, `<h3>`,
 * `<ul>` straight into the column). The panel now edits markdown, so those rows
 * are converted once — on the server, when the panel loads — instead of being
 * handed to the markdown editor, which would show the tags as literal text and
 * save them that way on the next keystroke.
 *
 * Idempotent: content that is already markdown is returned untouched.
 */
const LOOKS_LIKE_HTML = /^\s*<(?:p|h[1-6]|ul|ol|blockquote|div|figure)\b/i;

export function htmlToMarkdown(content: string): string {
  if (!content.trim() || !LOOKS_LIKE_HTML.test(content)) return content;

  return turndown.turndown(content).trim();
}
