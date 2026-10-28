import type { Metadata } from "next";

import SkillsPage from "./_components/SkillsPage";

export const metadata: Metadata = { title: "Skills" };

export default function SkillsRoute() {
  return <SkillsPage />;
}
