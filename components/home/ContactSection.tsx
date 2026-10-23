import type { Profile } from "@/lib/portfolio-api";

type ContactSectionProps = {
  profile: Profile | null;
};

export function ContactSection({ profile }: ContactSectionProps) {
  const email = profile?.email;
  const phone = profile?.phone;
  const linkedin = profile?.linkedin;
  const secondaryHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : linkedin || "#";
  const secondaryLabel = phone || (linkedin ? "LinkedIn" : "Contact unavailable");

  return (
    <section id="contact" className="px-[clamp(24px,5vw,64px)] py-[clamp(36px,7vw,96px)] bg-[#c8ff00] border-b-4 border-[#111]">
      <div className="text-[clamp(10px,1.2vw,13px)] font-bold uppercase tracking-[1px] text-[#111] mb-4">[ 06 ] Get In Touch</div>
      <h2 className="font-anton text-[clamp(44px,9vw,150px)] leading-[0.82] uppercase text-[#111] mb-[clamp(24px,4vw,36px)] tracking-[-1px]">
        Let&apos;s Build
        <br />
        Something.
      </h2>
      <div className="home-contact-actions">
        {email && (
          <a className="home-contact-actions__primary" href={`mailto:${email}`}>
            {email}
          </a>
        )}
        <a className="home-contact-actions__secondary" href={secondaryHref} aria-disabled={!phone && !linkedin}>
          {secondaryLabel}
        </a>
      </div>
    </section>
  );
}
