import type { Profile } from "@/lib/portfolio-api";
import { anton, mono } from "@/components/fonts";

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
    <section id="contact" style={{ padding: "clamp(36px,7vw,96px) clamp(24px,5vw,64px)", background: "#c8ff00", borderBottom: "4px solid #111" }}>
      <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#111", marginBottom: 16 }}>[ 06 ] Get In Touch</div>
      <h2 style={{ ...anton, fontSize: "clamp(44px,9vw,150px)", lineHeight: "0.82", textTransform: "uppercase", color: "#111", margin: "0 0 clamp(24px,4vw,36px)", letterSpacing: -1 }}>
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
