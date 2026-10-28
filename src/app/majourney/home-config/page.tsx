import type { Metadata } from "next";

import HomeConfigPage from "./_components/HomeConfigPage";

export const metadata: Metadata = { title: "Home config" };

export default function HomeConfigRoute() {
  return <HomeConfigPage />;
}
