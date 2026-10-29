import HomeConfigPage from "./_components/HomeConfigPage";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Home config" };

export default function HomeConfigRoute() {
  return <HomeConfigPage />;
}
