export type Post = {
  num: string;
  bg: string;
  fg: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  read: string;
  body: string[];
  image: { caption: string; placeholder: string };
};

export const posts: Post[] = [
  {
    num: "01", bg: "#1410ff", fg: "#c8ff00",
    title: "Building a Concurrent NFT Minting Pipeline with BullMQ + Redis",
    excerpt: "Queueing strategy, retry logic, and idempotency for high-throughput NFT minting on Tweetonium.",
    tags: ["Backend", "Redis"], date: "Mar 2026", read: "9 min",
    body: [
      "When Tweetonium needed to support burst minting events — hundreds of NFTs requested within seconds of a drop going live — a synchronous mint-on-request endpoint fell over almost immediately.",
      "The fix was a BullMQ queue backed by Redis, with each mint job carrying an idempotency key derived from wallet address and drop ID, so retries after a crash never double-minted.",
      "Concurrency was tuned per worker based on RPC rate limits from the chain provider, with exponential backoff on 429s and a dead-letter queue for anything that failed three times.",
      "The result: mint requests now return instantly with a job ID, and a lightweight polling endpoint lets the frontend show live status without blocking the user.",
    ],
    image: { caption: "Queue architecture — BullMQ workers pulling mint jobs off Redis.", placeholder: "Drop pipeline architecture diagram" },
  },
  {
    num: "02", bg: "#c8ff00", fg: "#111",
    title: "A Block-Based Rich-Text Editor in React Native",
    excerpt: "How Binder handles live markdown, block structure, and draft auto-save.",
    tags: ["React Native", "Editor"], date: "Sep 2025", read: "11 min",
    body: [
      "Binder needed an editor that felt like Notion but ran smoothly on mobile — no easy task given React Native's text input limitations.",
      "The approach: model content as an array of typed blocks (paragraph, heading, list item, image) rather than one giant string, so each block re-renders independently.",
      "Markdown shortcuts (## for heading, - for list) are detected on keystroke and swap the block type live, giving the \"live markdown\" feel without a heavyweight parser running on every render.",
      "Drafts auto-save to local storage every few seconds and sync to the server on a debounce, so a dropped connection never costs the user their work.",
    ],
    image: { caption: "Binder's block-based editor mid-edit.", placeholder: "Drop editor screenshot" },
  },
  {
    num: "03", bg: "#1410ff", fg: "#c8ff00",
    title: "Performance Patterns for Large FlatLists in React Native",
    excerpt: "Virtualization, memoization, and windowing techniques that actually move the needle.",
    tags: ["React Native", "Performance"], date: "Jun 2025", read: "8 min",
    body: [
      "At Flip.id, transaction history screens routinely rendered thousands of rows. The default FlatList config choked well before that scale.",
      "Tuning windowSize, maxToRenderPerBatch, and removeClippedSubviews cut initial render time significantly, but the bigger win came from memoizing row components with React.memo and stable keyExtractors.",
      "Avoiding inline function props on renderItem — a common but easy-to-miss mistake — stopped rows from re-rendering on every parent update.",
      "Combined, these changes took scroll jank on low-end Android devices from constant frame drops to a consistently smooth 60fps.",
    ],
    image: { caption: "FlatList profiling before vs. after tuning.", placeholder: "Drop performance profiler screenshot" },
  },
  {
    num: "04", bg: "#c8ff00", fg: "#111",
    title: "Expo Router in Production: File-Based Routing at Scale",
    excerpt: "Lessons from migrating a large fintech app to file-based navigation.",
    tags: ["React Native", "Expo"], date: "Feb 2025", read: "7 min",
    body: [
      "Migrating Flip.id's navigation stack to Expo Router meant rethinking dozens of screens organized by manual React Navigation config into a file-based tree.",
      "The biggest gain was route-level code splitting — each screen file became a natural boundary for lazy loading, shrinking initial bundle size.",
      "Deep linking also got dramatically simpler: the file path became the link structure, removing a whole layer of manual URL-to-screen mapping.",
      "The migration wasn't risk-free — nested layouts required care to avoid unnecessary remounts — but the long-term maintainability win was worth it.",
    ],
    image: { caption: "Expo Router file tree mapped to app routes.", placeholder: "Drop file-based routing diagram" },
  },
  {
    num: "05", bg: "#1410ff", fg: "#c8ff00",
    title: "Zustand vs Redux: What I Learned Shipping Both",
    excerpt: "State management tradeoffs from real mobile codebases.",
    tags: ["React Native", "State"], date: "Nov 2024", read: "6 min",
    body: [
      "Redux served Flip.id well for years, but the boilerplate around actions, reducers, and selectors slowed down every new feature.",
      "Zustand's minimal API — a single hook, no providers, no boilerplate — cut the code needed for a typical feature's state by more than half.",
      "The tradeoff: Redux's strict unidirectional flow and DevTools made large, multi-team codebases easier to reason about and debug.",
      "For a small, fast-moving mobile team, Zustand won. For a large one with many contributors, Redux's guardrails still have a place.",
    ],
    image: { caption: "Zustand store powering the transfer flow.", placeholder: "Drop state management diagram" },
  },
  {
    num: "06", bg: "#c8ff00", fg: "#111",
    title: "Designing a Test Automation Strategy with Appium",
    excerpt: "How the TE team and I built mobile test coverage that actually caught regressions.",
    tags: ["Testing", "Mobile"], date: "Aug 2024", read: "10 min",
    body: [
      "Manual regression testing before every Flip.id release was slow and inconsistent. Working with the TE team, we built an Appium suite targeting the highest-risk flows first: login, transfers, and payments.",
      "Page-object patterns kept tests maintainable as the UI changed, and tagging tests by risk level let us run a fast smoke suite on every PR and a full suite nightly.",
      "The suite caught several regressions before they reached production in its first quarter, paying for the setup cost almost immediately.",
      "The real unlock was cultural: engineers started writing tests alongside features instead of treating QA as a separate, later phase.",
    ],
    image: { caption: "Appium suite results in CI.", placeholder: "Drop test run screenshot" },
  },
];
