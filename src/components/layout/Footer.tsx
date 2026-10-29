import { SOCIAL_LINKS } from "@/constants/site";
import { cn } from "@/lib/cn";

interface FooterProps {
  subpage?: boolean;
}

const Footer = ({ subpage = false }: FooterProps) => {
  return (
    <footer
      className={cn(
        "bg-ink text-paper flex flex-wrap items-center justify-between gap-4 px-[clamp(24px,5vw,64px)] py-[clamp(24px,4vw,48px)]",
        subpage && "border-ink border-t-4",
      )}
    >
      <span className="font-anton text-paper text-[clamp(24px,4vw,38px)] tracking-[1px] uppercase">
        AREYDRA<span className="text-lime">.</span>
      </span>
      {!subpage && (
        <div className="border-paper flex flex-wrap border-2">
          {SOCIAL_LINKS.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cn(
                "text-paper hover:bg-azure px-[clamp(12px,1.5vw,18px)] py-[clamp(8px,1vw,10px)] text-[clamp(10px,1.1vw,12px)] font-bold tracking-[1px] uppercase no-underline transition-colors",
                index > 0 && "border-paper border-l-2",
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      <span className="text-[clamp(9px,1vw,12px)] font-bold tracking-[1px] uppercase opacity-60">
        Bogor, ID — © 2026
      </span>
    </footer>
  );
};

export default Footer;
