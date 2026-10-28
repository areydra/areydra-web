import { safeExternalUrl, toMailtoHref } from "@/lib/safe-url";

type SocialLink = {
  label: string;
  href: string;
  external?: boolean;
};

const GITHUB = safeExternalUrl("https://github.com/areydra");
const LINKEDIN = safeExternalUrl("https://linkedin.com/in/areydra");
const EMAIL = toMailtoHref("areydra@gmail.com");

/** Static, trusted links — the only place site-wide contact data lives. */
export const SOCIAL_LINKS: SocialLink[] = [
  ...(GITHUB ? [{ label: "GitHub", href: GITHUB, external: true }] : []),
  ...(LINKEDIN ? [{ label: "LinkedIn", href: LINKEDIN, external: true }] : []),
  ...(EMAIL ? [{ label: "Email", href: EMAIL }] : []),
];

export const SITE_NAME = "Areydra";
export const SITE_DESCRIPTION = "Software Engineer portfolio for Areydra.";
