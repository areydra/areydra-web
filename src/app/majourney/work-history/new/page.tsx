import type { Metadata } from "next";

import NewWorkHistoryPage from "./_components/NewWorkHistoryPage";

export const metadata: Metadata = { title: "New work history" };

export default function NewWorkHistoryRoute() {
  return <NewWorkHistoryPage />;
}
