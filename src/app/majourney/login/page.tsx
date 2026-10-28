import type { Metadata } from "next";

import LoginPage from "./_components/LoginPage";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginRoute() {
  return <LoginPage />;
}
