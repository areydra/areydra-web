"use client";

import { useState, useEffect, useRef } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

const skillGroups = [
  { title: "Languages",      items: ["JavaScript", "TypeScript", "Swift", "Kotlin", "Java"] },
  { title: "Frameworks",     items: ["React Native", "React", "Next.js", "Vite", "Hono"] },
  { title: "Mobile",         items: ["Expo", "Zustand", "SwiftUI", "Combine", "Core Data"] },
  { title: "Backend & Data", items: ["PostgreSQL", "Redis", "BullMQ", "MinIO", "React Query"] },
  { title: "Tools",          items: ["Xcode", "Firebase", "TestFlight", "Git", "Postman", "Appium"] },
  { title: "Practices",      items: ["MVVM", "Unit Testing", "UI Testing", "Agile", "Native Modules"] },
];

const jobs = [
  { num: "01", title: "Full Stack Engineer", company: "Tweetonium · Freelance", period: "2025 — 2026", desc: "Early-team engineer on a Web3 NFT platform. Architected the full stack — Hono backend, Vite + React frontend, BullMQ + Redis pipeline for concurrent NFT minting, PostgreSQL, and MinIO object storage." },
  { num: "02", title: "Software Engineer",   company: "Akal · Freelance",        period: "2025",        desc: "Built Binder, a React Native / Expo learning & collaboration app: block-based rich-text editor with real-time markdown, draft auto-save, collaborative editing, and social systems backed by TanStack Query." },
  { num: "03", title: "Software Engineer",   company: "Flip.id",                 period: "2022 — 2025", desc: "Led technical meetings and PoCs (AppsFlyer, Firebase, Storybook, CI/CD), drove mobile test automation with the TE team, and shipped performant features using Expo Router, Zustand, and FlatList virtualization." },
  { num: "04", title: "Mobile Developer",    company: "Flip.id",                 period: "2019 — 2022", desc: "Junior mobile developer focused on minimal-defect delivery, peer code review, and owning release uploads to the Play Store and App Store." },
];

const projects = [
  { mono: "TW", name: "Tweetonium", desc: "Web3 NFT DAO platform. Full-stack — Hono API, async minting via BullMQ + Redis, MinIO asset storage, and a Tailwind component library.",                  tags: ["Hono", "Redis", "PostgreSQL", "React"] },
  { mono: "BI", name: "Binder",     desc: "React Native / Expo learning & collaboration app with block-based rich-text, real-time markdown, collaborative editing, and social systems.",            tags: ["React Native", "Expo", "Live Markdown"] },
  { mono: "FL", name: "Flip.id",    desc: "Fintech mobile app — performant React Native with Expo Router file-based routing, Zustand state, and FlatList virtualization under TypeScript strict mode.", tags: ["React Native", "Expo", "Zustand", "TS"] },
];

const posts = [
  { num: "01", title: "Building a Concurrent NFT Minting Pipeline with BullMQ + Redis", tags: ["Backend", "Redis"],           date: "Mar 2026", read: "9 min" },
  { num: "02", title: "A Block-Based Rich-Text Editor in React Native",                  tags: ["React Native", "Editor"],      date: "Sep 2025", read: "11 min" },
  { num: "03", title: "Performance Patterns for Large FlatLists in React Native",        tags: ["React Native", "Performance"], date: "Jun 2025", read: "8 min" },
];

const mono = { fontFamily: "var(--font-space-mono), monospace" };
const anton = { fontFamily: "var(--font-anton), sans-serif" };
const archivo = { fontFamily: "var(--font-archivo), sans-serif" };

export default function Home() {
  const [invert, setInvert]     = useState(false);
  const [clock, setClock]       = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const width  = useWindowWidth();

  const isMobile  = width < 640;
  const isTablet  = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // Close mobile menu when resizing to tablet/desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const navHeight = navRef.current?.offsetHeight ?? 58;

  const heroGridCols    = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1.5fr 1fr";
  const skillGridCols   = isDesktop ? "repeat(3,1fr)" : isTablet ? "repeat(2,1fr)" : "repeat(1,1fr)";
  const projectGridCols = isDesktop ? "repeat(3,1fr)" : isTablet ? "repeat(2,1fr)" : "repeat(1,1fr)";

  return (
    <div
      style={{
        background: "#ebe7d9",
        minHeight: "100vh",
        filter: invert ? "invert(1) hue-rotate(180deg)" : "none",
        transition: "filter 0.15s",
      }}
    >
      {/* STATUS STRIP */}
      <div
        style={{
          background: "#111",
          color: "#ebe7d9",
          ...mono,
          fontSize: "clamp(10px, 1.2vw, 12px)",
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px clamp(14px, 4vw, 40px)",
          borderBottom: "3px solid #111",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              background: "#c8ff00",
              display: "inline-block",
              animation: "bblink 1.4s steps(1) infinite",
            }}
          />
          AVAILABLE FOR WORK
        </span>
        <span style={{ opacity: 0.7 }}>{clock}</span>
      </div>

      {/* NAV */}
      <nav
        ref={navRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 500,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          background: "#ebe7d9",
          borderBottom: "4px solid #111",
        }}
      >
        <a
          href="#"
          style={{ display: "flex", alignItems: "center", textDecoration: "none", borderRight: "4px solid #111", flexShrink: 0 }}
        >
          <span
            style={{
              ...anton,
              background: "#1410ff",
              color: "#fff",
              fontSize: "clamp(22px, 3.5vw, 30px)",
              lineHeight: "1",
              padding: "clamp(10px,1.5vw,14px) clamp(12px,2vw,18px) clamp(8px,1.2vw,10px)",
              letterSpacing: 1,
            }}
          >
            AR
          </span>
          <span
            style={{
              ...anton,
              fontSize: "clamp(16px, 2.5vw, 24px)",
              color: "#111",
              padding: "0 clamp(10px, 2vw, 18px)",
              letterSpacing: 1,
              whiteSpace: "nowrap",
            }}
          >
            AREYDRA
          </span>
        </a>

        {/* Desktop + tablet nav links */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "stretch", overflowX: "auto" }}>
            {["About", "Skills", "Work", "Projects", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 clamp(10px, 1.5vw, 20px)",
                  ...mono,
                  fontSize: "clamp(10px, 1.2vw, 13px)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "#111",
                  textDecoration: "none",
                  borderLeft: "2px solid #111",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#c8ff00")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                {item}
              </a>
            ))}
            <button
              onClick={() => setInvert((v) => !v)}
              style={{
                cursor: "pointer",
                padding: "0 clamp(10px, 1.5vw, 20px)",
                ...mono,
                fontSize: "clamp(10px, 1.2vw, 13px)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#ebe7d9",
                background: "#111",
                border: "none",
                borderLeft: "4px solid #111",
                whiteSpace: "nowrap",
              }}
            >
              [ {invert ? "LIGHT" : "INVERT"} ]
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <button
              onClick={() => setInvert((v) => !v)}
              style={{
                cursor: "pointer",
                padding: "0 14px",
                ...mono,
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#ebe7d9",
                background: "#111",
                border: "none",
                borderLeft: "4px solid #111",
              }}
            >
              INV
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                cursor: "pointer",
                padding: "0 18px",
                ...anton,
                fontSize: 26,
                color: "#111",
                background: "#ebe7d9",
                border: "none",
                borderLeft: "4px solid #111",
                lineHeight: "1",
              }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        )}
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: navHeight,
            left: 0,
            right: 0,
            zIndex: 499,
            background: "#ebe7d9",
            borderBottom: "4px solid #111",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {["About", "Skills", "Work", "Projects", "Contact"].map((item, i, arr) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "18px 24px",
                ...anton,
                fontSize: 28,
                textTransform: "uppercase",
                color: "#111",
                textDecoration: "none",
                borderBottom: i < arr.length - 1 ? "3px solid #111" : undefined,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#c8ff00")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {item}
            </a>
          ))}
        </div>
      )}

      {/* HERO */}
      <section
        style={{
          borderBottom: "4px solid #111",
          display: "grid",
          gridTemplateColumns: heroGridCols,
        }}
      >
        <div
          style={{
            padding: "clamp(24px, 5vw, 64px)",
            borderRight: isMobile ? "none" : "4px solid #111",
          }}
        >
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
            React Native · Full-Stack Engineer
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
              Areydra
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
            Software engineer with 5+ years building scalable React Native apps and delivering high-performance products. Now full-stack — Hono, PostgreSQL, BullMQ &amp; Redis.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 0,
              marginTop: "clamp(24px, 4vw, 36px)",
              border: "3px solid #111",
              width: isMobile ? "100%" : "fit-content",
              boxShadow: "8px 8px 0 #111",
            }}
          >
            <a
              href="#projects"
              style={{
                flex: 1,
                textAlign: "center",
                ...mono,
                fontSize: "clamp(12px, 1.3vw, 15px)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#fff",
                background: "#1410ff",
                padding: "clamp(12px,1.5vw,16px) clamp(18px,2.5vw,30px)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              View Projects →
            </a>
            <a
              href="#contact"
              style={{
                flex: 1,
                textAlign: "center",
                ...mono,
                fontSize: "clamp(12px, 1.3vw, 15px)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#111",
                background: "#ebe7d9",
                padding: "clamp(12px,1.5vw,16px) clamp(18px,2.5vw,30px)",
                textDecoration: "none",
                borderTop: isMobile ? "3px solid #111" : undefined,
                borderLeft: isMobile ? undefined : "3px solid #111",
                whiteSpace: "nowrap",
              }}
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Right panel — hidden on mobile */}
        {!isMobile && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                flex: 1,
                background: "#1410ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "4px solid #111",
                minHeight: "clamp(160px, 22vw, 320px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(45deg,transparent,transparent 14px,rgba(255,255,255,0.08) 14px,rgba(255,255,255,0.08) 28px)",
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
                A
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: "clamp(16px,2vw,22px)", borderRight: "3px solid #111" }}>
                <div style={{ ...anton, fontSize: "clamp(36px,4.5vw,54px)", color: "#111", lineHeight: "0.9" }}>6+</div>
                <div style={{ ...mono, fontSize: "clamp(10px,1vw,12px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#111", marginTop: 4 }}>Years Exp.</div>
              </div>
              <div style={{ padding: "clamp(16px,2vw,22px)" }}>
                <div style={{ ...anton, fontSize: "clamp(36px,4.5vw,54px)", color: "#111", lineHeight: "0.9" }}>3</div>
                <div style={{ ...mono, fontSize: "clamp(10px,1vw,12px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#111", marginTop: 4 }}>Companies</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* MARQUEE */}
      <div style={{ background: "#c8ff00", borderBottom: "4px solid #111", overflow: "hidden", padding: "clamp(10px,1.5vw,14px) 0" }}>
        <div
          style={{
            display: "inline-flex",
            whiteSpace: "nowrap",
            animation: "bmarquee 22s linear infinite",
            ...anton,
            fontSize: "clamp(18px, 3vw, 30px)",
            textTransform: "uppercase",
            color: "#111",
            letterSpacing: 1,
          }}
        >
          <span style={{ padding: "0 20px" }}>REACT NATIVE ✦ TYPESCRIPT ✦ EXPO ✦ SWIFT ✦ KOTLIN ✦ HONO ✦ POSTGRESQL ✦ REDIS ✦ BULLMQ ✦ REACT ✦ VITE ✦ </span>
          <span style={{ padding: "0 20px" }} aria-hidden="true">REACT NATIVE ✦ TYPESCRIPT ✦ EXPO ✦ SWIFT ✦ KOTLIN ✦ HONO ✦ POSTGRESQL ✦ REDIS ✦ BULLMQ ✦ REACT ✦ VITE ✦ </span>
        </div>
      </div>

      {/* STATS — gap technique: dark container + cream cells */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          background: "#111",
          gap: 3,
          borderBottom: "4px solid #111",
        }}
      >
        {[
          { val: "6+", label: "Years Exp." },
          { val: "3",  label: "Roles Held" },
          { val: "3",  label: "Companies" },
          { val: "5",  label: "Languages" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#ebe7d9", padding: "clamp(20px,3vw,34px) clamp(14px,3vw,40px)" }}>
            <div style={{ ...anton, fontSize: "clamp(36px,5vw,72px)", color: "#1410ff", lineHeight: "0.9", WebkitTextStroke: "clamp(1px,0.2vw,2px) #111" }}>{stat.val}</div>
            <div style={{ ...mono, fontSize: "clamp(10px,1vw,12px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#111", marginTop: 8 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <section
        id="about"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          borderBottom: "4px solid #111",
        }}
      >
        <div
          style={{
            padding: "clamp(24px, 5vw, 64px)",
            borderRight: isMobile ? "none" : "4px solid #111",
            borderBottom: isMobile ? "4px solid #111" : "none",
          }}
        >
          <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#1410ff", marginBottom: 14 }}>[ 01 ] About Me</div>
          <h2
            style={{
              ...anton,
              fontSize: "clamp(28px, 4.5vw, 68px)",
              lineHeight: "0.92",
              textTransform: "uppercase",
              color: "#111",
              margin: "0 0 clamp(16px,2.5vw,26px)",
              letterSpacing: -0.5,
            }}
          >
            Mobile-first, now full-stack.
          </h2>
          <p style={{ ...archivo, fontSize: "clamp(14px,1.5vw,16px)", fontWeight: 500, lineHeight: 1.7, color: "#111", margin: "0 0 14px" }}>
            I&apos;m Areydra Desfikriandre — a software engineer based in Bogor, Indonesia, with 5+ years shipping scalable React Native apps. I work closely with Backend, QA, and UX teams to ship reliable features.
          </p>
          <p style={{ ...archivo, fontSize: "clamp(14px,1.5vw,16px)", fontWeight: 500, lineHeight: 1.7, color: "#111", margin: 0 }}>
            Recently gone full-stack — Hono APIs, PostgreSQL schemas, BullMQ + Redis async pipelines, and modern web UIs with React, Vite, React Query, and Tailwind.
          </p>
        </div>

        {/* About cards — gap technique */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#111", gap: 3 }}>
          {[
            { num: "01", title: "Cross-Functional",  desc: "Ships with Backend, QA & UX teams — reliable features, stable production.", highlight: false },
            { num: "02", title: "Perf-Obsessed",     desc: "FlatList virtualization, memoization & efficient re-renders for big datasets.", highlight: false },
            { num: "03", title: "Quality First",     desc: "Unit & UI testing, code review, minimal-defect delivery as standard.", highlight: true },
            { num: "04", title: "Tech Lead",         desc: "Runs technical meetings & PoCs, evaluating tools and driving conventions.", highlight: false },
          ].map((card) => (
            <div
              key={card.num}
              style={{
                background: card.highlight ? "#c8ff00" : "#ebe7d9",
                padding: "clamp(16px, 2.5vw, 28px)",
              }}
            >
              <div
                style={{
                  ...anton,
                  fontSize: "clamp(22px, 3vw, 30px)",
                  color: card.highlight ? "#111" : "#1410ff",
                  lineHeight: "1",
                  WebkitTextStroke: card.highlight ? undefined : "1.5px #111",
                }}
              >
                {card.num}
              </div>
              <div style={{ ...archivo, fontSize: "clamp(13px,1.4vw,17px)", fontWeight: 800, textTransform: "uppercase", color: "#111", margin: "10px 0 6px" }}>{card.title}</div>
              <div style={{ ...archivo, fontSize: "clamp(12px,1.2vw,14px)", fontWeight: 500, lineHeight: 1.55, color: "#111" }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding: "clamp(24px, 5vw, 64px)", borderBottom: "4px solid #111" }}>
        <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#1410ff", marginBottom: 12 }}>[ 02 ] Technical Skills</div>
        <h2 style={{ ...anton, fontSize: "clamp(28px,4.5vw,68px)", lineHeight: "0.92", textTransform: "uppercase", color: "#111", margin: "0 0 clamp(24px,4vw,40px)", letterSpacing: -0.5 }}>The Stack</h2>
        {/* Gap technique: dark background + cream cells */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: skillGridCols,
            gap: 3,
            background: "#111",
            border: "3px solid #111",
            boxShadow: "8px 8px 0 #111",
          }}
        >
          {skillGroups.map((g) => (
            <div key={g.title} style={{ background: "#ebe7d9", padding: "clamp(16px, 2.5vw, 28px)" }}>
              <div style={{ ...mono, fontSize: "clamp(10px,1vw,12px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#1410ff", marginBottom: 14 }}>{g.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {g.items.map((s) => (
                  <span
                    key={s}
                    style={{
                      ...archivo,
                      fontSize: "clamp(11px, 1.1vw, 13px)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#111",
                      background: "#ebe7d9",
                      border: "2px solid #111",
                      padding: "4px 10px",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="work" style={{ borderBottom: "4px solid #111" }}>
        <div style={{ padding: "clamp(24px,5vw,64px) clamp(24px,5vw,64px) 0" }}>
          <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#1410ff", marginBottom: 12 }}>[ 03 ] Work History</div>
          <h2 style={{ ...anton, fontSize: "clamp(28px,4.5vw,68px)", lineHeight: "0.92", textTransform: "uppercase", color: "#111", margin: "0 0 clamp(24px,4vw,40px)", letterSpacing: -0.5 }}>
            Where I&apos;ve Worked
          </h2>
        </div>
        {jobs.map((j) => (
          <div
            key={j.num}
            style={{
              display: "flex",
              gap: "clamp(14px, 3vw, 40px)",
              alignItems: "flex-start",
              padding: "clamp(20px,3vw,40px) clamp(24px,5vw,64px)",
              borderTop: "3px solid #111",
            }}
          >
            <div
              style={{
                ...anton,
                fontSize: "clamp(32px, 5vw, 80px)",
                color: "#1410ff",
                lineHeight: "0.8",
                WebkitTextStroke: "clamp(1px,0.3vw,2px) #111",
                minWidth: "clamp(60px, 8vw, 110px)",
                flexShrink: 0,
              }}
            >
              {j.num}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Title + period badge inline */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
                <h3 style={{ ...archivo, fontSize: "clamp(17px,2.2vw,30px)", fontWeight: 900, textTransform: "uppercase", color: "#111", margin: 0 }}>{j.title}</h3>
                <div
                  style={{
                    ...mono,
                    fontSize: "clamp(11px,1.1vw,13px)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#111",
                    background: "#c8ff00",
                    border: "3px solid #111",
                    padding: "6px 12px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {j.period}
                </div>
              </div>
              <div style={{ ...mono, fontSize: "clamp(13px,1.4vw,15px)", fontWeight: 700, color: "#1410ff" }}>{j.company}</div>
              <p style={{ ...archivo, fontSize: "clamp(13px,1.3vw,15px)", fontWeight: 500, lineHeight: 1.6, color: "#111", margin: "12px 0 0" }}>{j.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "clamp(24px,5vw,64px)", borderBottom: "4px solid #111", background: "#1410ff" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: "clamp(24px,4vw,40px)" }}>
          <div>
            <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#c8ff00", marginBottom: 12 }}>[ 04 ] Portfolio</div>
            <h2 style={{ ...anton, fontSize: "clamp(28px,4.5vw,68px)", lineHeight: "0.92", textTransform: "uppercase", color: "#ebe7d9", margin: 0, letterSpacing: -0.5 }}>Featured Projects</h2>
          </div>
          <a
            href="/projects"
            style={{
              ...mono,
              fontSize: "clamp(12px,1.3vw,14px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#111",
              background: "#c8ff00",
              border: "3px solid #111",
              padding: "clamp(10px,1.2vw,12px) clamp(16px,2vw,22px)",
              textDecoration: "none",
              boxShadow: "6px 6px 0 #0a0a0a",
              flexShrink: 0,
            }}
          >
            View All →
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: projectGridCols, gap: "clamp(14px, 2vw, 22px)" }}>
          {projects.map((p) => (
            <div key={p.name} style={{ background: "#ebe7d9", border: "3px solid #111", boxShadow: "6px 6px 0 #0a0a0a", display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  height: "clamp(100px, 12vw, 150px)",
                  background: "#c8ff00",
                  borderBottom: "3px solid #111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...anton,
                  fontSize: "clamp(36px, 6vw, 60px)",
                  color: "#111",
                  letterSpacing: -2,
                }}
              >
                {p.mono}
              </div>
              <div style={{ padding: "clamp(16px,2vw,22px)", display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ ...archivo, fontSize: "clamp(16px,1.8vw,21px)", fontWeight: 900, textTransform: "uppercase", color: "#111", margin: "0 0 8px" }}>{p.name}</h3>
                <p style={{ ...archivo, fontSize: "clamp(12px,1.2vw,14px)", fontWeight: 500, lineHeight: 1.6, color: "#111", margin: "0 0 14px", flex: 1 }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                  {p.tags.map((t) => (
                    <span key={t} style={{ ...mono, fontSize: "clamp(9px,1vw,11px)", fontWeight: 700, textTransform: "uppercase", color: "#111", border: "2px solid #111", padding: "3px 7px" }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 0, border: "3px solid #111" }}>
                  <a href="/projects" style={{ flex: 1, textAlign: "center", ...mono, fontSize: "clamp(10px,1.1vw,12px)", fontWeight: 700, textTransform: "uppercase", color: "#fff", background: "#1410ff", padding: "clamp(8px,1vw,10px)", textDecoration: "none" }}>Details</a>
                  <a href="https://github.com/areydra" style={{ flex: 1, textAlign: "center", ...mono, fontSize: "clamp(10px,1.1vw,12px)", fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#ebe7d9", padding: "clamp(8px,1vw,10px)", textDecoration: "none", borderLeft: "3px solid #111" }}>GitHub ↗</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" style={{ padding: "clamp(24px,5vw,64px)", borderBottom: "4px solid #111" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: "clamp(24px,4vw,40px)" }}>
          <div>
            <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#1410ff", marginBottom: 12 }}>[ 05 ] Writing</div>
            <h2 style={{ ...anton, fontSize: "clamp(28px,4.5vw,68px)", lineHeight: "0.92", textTransform: "uppercase", color: "#111", margin: 0, letterSpacing: -0.5 }}>From The Blog</h2>
          </div>
          <a
            href="/blog"
            style={{ ...mono, fontSize: "clamp(12px,1.3vw,14px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#111", border: "3px solid #111", padding: "clamp(10px,1.2vw,12px) clamp(16px,2vw,22px)", textDecoration: "none" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#c8ff00")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            All Posts →
          </a>
        </div>
        <div style={{ border: "3px solid #111" }}>
          {posts.map((b, i) => (
            <a
              key={b.num}
              href="/blog"
              style={{
                display: "flex",
                gap: 20,
                alignItems: "center",
                flexWrap: "wrap",
                padding: "clamp(18px,2.5vw,24px) clamp(18px,3vw,32px)",
                textDecoration: "none",
                borderBottom: i < posts.length - 1 ? "3px solid #111" : undefined,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f5f2e8")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <div style={{ ...anton, fontSize: "clamp(24px,3vw,32px)", color: "#1410ff", lineHeight: "0.9", WebkitTextStroke: "1.5px #111", minWidth: 50, flexShrink: 0 }}>{b.num}</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{ ...archivo, fontSize: "clamp(15px,1.8vw,22px)", fontWeight: 800, color: "#111", margin: "0 0 8px", lineHeight: 1.2 }}>{b.title}</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {b.tags.map((t) => (
                    <span key={t} style={{ ...mono, fontSize: "clamp(9px,1vw,11px)", fontWeight: 700, textTransform: "uppercase", color: "#111", background: "#c8ff00", border: "2px solid #111", padding: "2px 8px" }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ ...mono, fontSize: "clamp(10px,1vw,12px)", fontWeight: 700, textTransform: "uppercase", color: "#111", whiteSpace: "nowrap", textAlign: "right", flexShrink: 0 }}>
                {b.date}
                <br />
                <span style={{ opacity: 0.6 }}>{b.read}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "clamp(36px,7vw,96px) clamp(24px,5vw,64px)", background: "#c8ff00", borderBottom: "4px solid #111" }}>
        <div style={{ ...mono, fontSize: "clamp(10px,1.2vw,13px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#111", marginBottom: 16 }}>[ 06 ] Get In Touch</div>
        <h2 style={{ ...anton, fontSize: "clamp(44px,9vw,150px)", lineHeight: "0.82", textTransform: "uppercase", color: "#111", margin: "0 0 clamp(24px,4vw,36px)", letterSpacing: -1 }}>
          Let&apos;s Build
          <br />
          Something.
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 0,
            border: "3px solid #111",
            width: isMobile ? "100%" : "fit-content",
            boxShadow: "8px 8px 0 #111",
          }}
        >
          <a
            href="mailto:areydra@gmail.com"
            style={{
              flex: 1,
              textAlign: "center",
              ...mono,
              fontSize: "clamp(12px,1.4vw,15px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#fff",
              background: "#1410ff",
              padding: "clamp(14px,1.8vw,18px) clamp(16px,2.5vw,32px)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            areydra@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/areydra"
            style={{
              flex: 1,
              textAlign: "center",
              ...mono,
              fontSize: "clamp(12px,1.4vw,15px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#111",
              background: "#ebe7d9",
              padding: "clamp(14px,1.8vw,18px) clamp(16px,2.5vw,32px)",
              textDecoration: "none",
              borderTop: isMobile ? "3px solid #111" : undefined,
              borderLeft: isMobile ? undefined : "3px solid #111",
              whiteSpace: "nowrap",
            }}
          >
            +62 838 0710 6451
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#111",
          color: "#ebe7d9",
          padding: "clamp(24px,4vw,48px) clamp(24px,5vw,64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span style={{ ...anton, fontSize: "clamp(24px,4vw,38px)", textTransform: "uppercase", color: "#ebe7d9", letterSpacing: 1 }}>
          AREYDRA<span style={{ color: "#c8ff00" }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 0, border: "2px solid #ebe7d9", flexWrap: "wrap" }}>
          {[
            { label: "GitHub",   href: "https://github.com/areydra" },
            { label: "LinkedIn", href: "https://linkedin.com/in/areydra" },
            { label: "Email",    href: "mailto:areydra@gmail.com" },
          ].map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                ...mono,
                fontSize: "clamp(10px,1.1vw,12px)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#ebe7d9",
                padding: "clamp(8px,1vw,10px) clamp(12px,1.5vw,18px)",
                textDecoration: "none",
                borderLeft: i > 0 ? "2px solid #ebe7d9" : undefined,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1410ff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {link.label}
            </a>
          ))}
        </div>
        <span style={{ ...mono, fontSize: "clamp(9px,1vw,12px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, opacity: 0.6 }}>Bogor, ID — © 2026</span>
      </footer>
    </div>
  );
}
