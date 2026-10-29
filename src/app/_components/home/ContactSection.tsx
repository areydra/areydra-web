import { safeExternalUrl, toMailtoHref, toTelHref } from "@/lib/safe-url";
import type { Profile } from "@/types/api.types";

interface ContactSectionProps {
  profile: Profile | null;
}

const ContactSection = ({ profile }: ContactSectionProps) => {
  const emailHref = toMailtoHref(profile?.email);
  const phoneHref = toTelHref(profile?.phone);
  const linkedinHref = safeExternalUrl(profile?.linkedin);

  const secondaryHref = phoneHref ?? linkedinHref;
  const secondaryLabel = profile?.phone ?? (linkedinHref ? "LinkedIn" : "Contact unavailable");

  return (
    <section
      id="contact"
      className="border-ink bg-lime border-b-4 px-[clamp(24px,5vw,64px)] py-[clamp(36px,7vw,96px)]"
    >
      <div className="text-ink mb-4 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] uppercase">
        [ 06 ] Get In Touch
      </div>
      <h2 className="font-anton text-ink mb-[clamp(24px,4vw,36px)] text-[clamp(44px,9vw,150px)] leading-[0.82] tracking-[-1px] uppercase">
        Let&apos;s Build
        <br />
        Something.
      </h2>
      <div className="home-contact-actions">
        {emailHref && (
          <a
            className="home-contact-actions__primary"
            href={emailHref}
          >
            {profile?.email}
          </a>
        )}
        {secondaryHref ? (
          <a
            className="home-contact-actions__secondary"
            href={secondaryHref}
            {...(phoneHref ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          >
            {secondaryLabel}
          </a>
        ) : (
          <span
            className="home-contact-actions__secondary"
            aria-disabled="true"
          >
            {secondaryLabel}
          </span>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
