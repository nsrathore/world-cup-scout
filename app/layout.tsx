import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scout AI — World Cup 2026 Matchup Intelligence",
  description:
    "AI-powered World Cup 2026 matchup analysis. Squad data, head-to-head history, tactical breakdowns, and Claude-generated scout reports for all 48 qualified nations.",
  keywords: ["World Cup 2026", "football", "soccer", "AI analysis", "matchup"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
