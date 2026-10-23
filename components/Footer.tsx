const socialLinks = [
  { label: "GitHub", href: "https://github.com/areydra" },
  { label: "LinkedIn", href: "https://linkedin.com/in/areydra" },
  { label: "Email", href: "mailto:areydra@gmail.com" },
];

export function Footer({ subpage = false }: { subpage?: boolean }) {
  return (
    <footer
      className={`bg-[#111] text-[#ebe7d9] px-[clamp(24px,5vw,64px)] py-[clamp(24px,4vw,48px)] flex items-center justify-between flex-wrap gap-4 ${subpage ? "border-t-4 border-[#111]" : ""}`}
    >
      <span className="font-anton text-[clamp(24px,4vw,38px)] uppercase text-[#ebe7d9] tracking-[1px]">
        AREYDRA<span className="text-[#c8ff00]">.</span>
      </span>
      {!subpage && (
        <div className="flex border-2 border-[#ebe7d9] flex-wrap">
          {socialLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-[clamp(10px,1.1vw,12px)] font-bold uppercase tracking-[1px] text-[#ebe7d9] px-[clamp(12px,1.5vw,18px)] py-[clamp(8px,1vw,10px)] no-underline hover:bg-[#1410ff] transition-colors ${i > 0 ? "border-l-2 border-[#ebe7d9]" : ""}`}
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
}
