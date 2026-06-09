import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Areydra",
  description: "Software Engineer portfolio for Areydra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
