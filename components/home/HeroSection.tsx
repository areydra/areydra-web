import type { Profile } from "@/lib/portfolio-api";
import { anton, archivo, mono } from "@/components/fonts";
import { formatCount } from "./formatters";

type HeroSectionProps = {
  profile: Profile | null;
};

export function HeroSection({ profile }: HeroSectionProps) {
  const name = profile?.name?.trim() || "Areydra";
  const firstName = name.split(/\s+/)[0] || name;
  const role = profile?.role || "Software Engineer";
  const tagline = profile?.tagline || "Portfolio data is loading from the backend.";
  const years = formatCount(profile?.yearsOfExperience, "+");
  const companies = formatCount(profile?.totalCompanies);

  return (
    <section className="home-hero">
      <div className="home-hero__content">
        <div
          style={{
            display: "inline-block",
            ...mono,
            fontSize: "clamp(10px, 1.3vw, 13px)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: "#111",
            background: "#c8ff00",
            border: "3px solid #111",
            padding: "5px 12px",
            marginBottom: "clamp(18px, 3vw, 26px)",
          }}
        >
          {role}
        </div>
        <h1
          style={{
            ...anton,
            fontSize: "clamp(52px, 11vw, 168px)",
            lineHeight: "0.82",
            letterSpacing: -1,
            color: "#111",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Hi,
          <br />
          I&apos;m
          <br />
          <span
            style={{
              color: "#1410ff",
              WebkitTextStroke: "clamp(1.5px, 0.3vw, 3px) #111",
            }}
          >
            {firstName}
          </span>
        </h1>
        <p
          style={{
            ...archivo,
            fontSize: "clamp(14px, 1.6vw, 20px)",
            fontWeight: 500,
            lineHeight: 1.55,
            color: "#111",
            maxWidth: 520,
            margin: "clamp(18px, 3vw, 30px) 0 0",
          }}
        >
          {tagline}
        </p>
        <div className="home-action-row">
          <a className="home-action-row__primary" href="#projects">
            View Projects -&gt;
          </a>
          <a className="home-action-row__secondary" href="#contact">
            Get in Touch
          </a>
        </div>
      </div>

      <div className="home-hero__side" aria-hidden="true">
        <div className="home-hero__mark">
          {profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatarUrl is an arbitrary uploaded/remote image, not a local asset
            <img
              src={profile.avatarUrl}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 14px,rgba(255,255,255,0.08) 14px,rgba(255,255,255,0.08) 28px)",
                }}
              />
              <span
                style={{
                  ...anton,
                  fontSize: "clamp(80px, 15vw, 220px)",
                  color: "#c8ff00",
                  lineHeight: "1",
                  position: "relative",
                  WebkitTextStroke: "clamp(2px, 0.4vw, 4px) #111",
                  userSelect: "none",
                }}
              >
                {firstName[0]?.toUpperCase() || "A"}
              </span>
            </>
          )}
        </div>
        <div className="home-hero__mini-stats">
          <MiniStat value={years} label="Years Exp." />
          <MiniStat value={companies} label="Companies" last />
        </div>
      </div>
    </section>
  );
}

function MiniStat({ value, label, last = false }: { value: string; label: string; last?: boolean }) {
  return (
    <div style={{ padding: "clamp(16px,2vw,22px)", borderRight: last ? undefined : "3px solid #111" }}>
      <div style={{ ...anton, fontSize: "clamp(36px,4.5vw,54px)", color: "#111", lineHeight: "0.9" }}>{value}</div>
      <div style={{ ...mono, fontSize: "clamp(10px,1vw,12px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#111", marginTop: 4 }}>{label}</div>
    </div>
  );
}
