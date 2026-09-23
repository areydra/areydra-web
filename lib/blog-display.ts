const PALETTE: { bg: string; fg: string }[] = [
  { bg: "#1410ff", fg: "#c8ff00" },
  { bg: "#c8ff00", fg: "#111" },
];

/**
 * Deterministic decorative color pair for a blog post's fallback thumbnail
 * block (used when the post has no thumbnailUrl), keyed by the post's id so
 * the same post always gets the same colors across renders.
 */
export function pickBlogPalette(id: string): { bg: string; fg: string } {
  const sum = Array.from(id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}
