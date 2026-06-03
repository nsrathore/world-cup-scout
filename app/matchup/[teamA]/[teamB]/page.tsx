import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTeamByTla } from "@/lib/teams-data";
import MatchupClient from "./MatchupClient";

interface PageProps {
  params: Promise<{ teamA: string; teamB: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { teamA: tlaA, teamB: tlaB } = await params;
  const a = getTeamByTla(tlaA);
  const b = getTeamByTla(tlaB);
  if (!a || !b) return { title: "Matchup Not Found" };

  return {
    title: `${a.name} vs ${b.name} — Scout AI | World Cup 2026`,
    description: `AI-powered matchup analysis: ${a.name} vs ${b.name}. Squad depth, tactical breakdown, head-to-head stats, and Claude-generated scout report.`,
    openGraph: {
      title: `${a.flagEmoji} ${a.name} vs ${b.name} ${b.flagEmoji}`,
      description: "World Cup 2026 AI matchup analysis powered by Claude",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og?teamA=${tlaA}&teamB=${tlaB}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function MatchupPage({ params }: PageProps) {
  const { teamA: tlaA, teamB: tlaB } = await params;

  const teamA = getTeamByTla(tlaA);
  const teamB = getTeamByTla(tlaB);

  if (!teamA || !teamB || teamA.tla === teamB.tla) {
    notFound();
  }

  return <MatchupClient teamA={teamA} teamB={teamB} />;
}
