import type { Metadata } from "next";

import EditWorkHistoryPage from "./_components/EditWorkHistoryPage";

export const metadata: Metadata = { title: "Edit work history" };

export default function EditWorkHistoryRoute() {
  return <EditWorkHistoryPage />;
}
