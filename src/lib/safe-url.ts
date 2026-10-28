const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Returns `href` only when it is a well-formed absolute http(s) URL, otherwise
 * `null`. Every URL that comes from stored data (project links, social links)
 * passes through here before it reaches an `href`: a `javascript:` value in a
 * database row is otherwise a stored XSS with one click.
 */
export function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Strips everything but digits and a leading `+` so a phone number is safe in `tel:`. */
export function toTelHref(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.replace(/[^\d+]/g, "");
  return normalized.length > 0 ? `tel:${normalized}` : null;
}

/** Returns `mailto:` only for a value that looks like a single email address. */
export function toMailtoHref(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? `mailto:${normalized}` : null;
}
