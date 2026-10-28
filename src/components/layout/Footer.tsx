import { SOCIAL_LINKS } from "@/constants/site";
import { cn } from "@/lib/cn";

type FooterProps = {
  subpage?: boolean;
};

const Footer = ({ subpage = false }: FooterProps) => {
  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 bg-ink px-[clamp(24px,5vw,64px)] py-[clamp(24px,4vw,48px)] text-paper",
        subpage && "border-t-4 border-ink",
      )}
    >
      <span className="font-anton text-[clamp(24px,4vw,38px)] uppercase tracking-[1px] text-paper">
        AREYDRA<span className="text-lime">.</span>
      </span>
      {!subpage && (
        <div className="flex flex-wrap border-2 border-paper">
          {SOCIAL_LINKS.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cn(
                "px-[clamp(12px,1.5vw,18px)] py-[clamp(8px,1vw,10px)] text-[clamp(10px,1.1vw,12px)] font-bold uppercase tracking-[1px] text-paper no-underline transition-colors hover:bg-azure",
                index > 0 && "border-l-2 border-paper",
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      <span className="text-[clamp(9px,1vw,12px)] font-bold uppercase tracking-[1px] opacity-60">
        Bogor, ID — © 2026
      </span>
    </footer>
  );
};

export default Footer;
