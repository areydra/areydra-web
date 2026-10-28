import { safeExternalUrl, toMailtoHref, toTelHref } from "@/lib/safe-url";
import type { Profile } from "@/types/api.types";

type ContactSectionProps = {
  profile: Profile | null;
};

const ContactSection = ({ profile }: ContactSectionProps) => {
  const emailHref = toMailtoHref(profile?.email);
  const phoneHref = toTelHref(profile?.phone);
  const linkedinHref = safeExternalUrl(profile?.linkedin);

  const secondaryHref = phoneHref ?? linkedinHref;
  const secondaryLabel =
    profile?.phone ?? (linkedinHref ? "LinkedIn" : "Contact unavailable");

  return (
    <section id="contact" className="border-b-4 border-ink bg-lime px-[clamp(24px,5vw,64px)] py-[clamp(36px,7vw,96px)]">
      <div className="mb-4 text-[clamp(10px,1.2vw,13px)] font-bold tracking-[1px] text-ink uppercase">
        [ 06 ] Get In Touch
      </div>
      <h2 className="font-anton mb-[clamp(24px,4vw,36px)] text-[clamp(44px,9vw,150px)] leading-[0.82] tracking-[-1px] text-ink uppercase">
        Let&apos;s Build
        <br />
        Something.
      </h2>
      <div className="home-contact-actions">
        {emailHref && (
          <a className="home-contact-actions__primary" href={emailHref}>
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
          <span className="home-contact-actions__secondary" aria-disabled="true">
            {secondaryLabel}
          </span>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
