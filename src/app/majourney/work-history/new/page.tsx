import NewWorkHistoryPage from "./_components/NewWorkHistoryPage";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "New work history" };

export default function NewWorkHistoryRoute() {
  return <NewWorkHistoryPage />;
}
