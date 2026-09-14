import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lean Mission — Personal Fitness OS",
  description: "A local-first 30-day strength, fat-loss and calisthenics plan.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
