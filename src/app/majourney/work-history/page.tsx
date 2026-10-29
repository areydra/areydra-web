import WorkHistoryPage from "./_components/WorkHistoryPage";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Work history" };

export default function WorkHistoryRoute() {
  return <WorkHistoryPage />;
}
