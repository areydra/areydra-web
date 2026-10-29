import LoginPage from "./_components/LoginPage";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginRoute() {
  return <LoginPage />;
}
