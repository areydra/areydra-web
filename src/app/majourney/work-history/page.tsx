import type { Metadata } from "next";

import WorkHistoryPage from "./_components/WorkHistoryPage";

export const metadata: Metadata = { title: "Work history" };

export default function WorkHistoryRoute() {
  return <WorkHistoryPage />;
}
