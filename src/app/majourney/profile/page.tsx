import ProfilePage from "./_components/ProfilePage";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default function ProfileRoute() {
  return <ProfilePage />;
}
