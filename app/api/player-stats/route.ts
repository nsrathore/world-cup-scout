// GET /api/player-stats?tla=BRA
// Returns top 5 players by goals + rating for the team (via BSD)
import { NextRequest, NextResponse } from "next/server";
import { getBSDTopPlayers } from "@/lib/bsd-api";
import { getTeamByTla } from "@/lib/teams-data";
import { withCache, TTL } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const tla = req.nextUrl.searchParams.get("tla");
  if (!tla) return NextResponse.json({ error: "tla required" }, { status: 400 });
  const team = getTeamByTla(tla);
  if (!team) return NextResponse.json({ error: `Unknown team: ${tla}` }, { status: 404 });
  try {
    const players = await withCache(
      `v2:bsd_player_stats_top:${team.bsdTeamId}`,
      TTL.STATS,
      () => getBSDTopPlayers(team.bsdTeamId)
    );
    return NextResponse.json({ team, players });
  } catch {
    return NextResponse.json({ error: "Failed to fetch player stats" }, { status: 500 });
  }
}
