/**
 * GET /api/h2h?tlaA=BRA&tlaB=FRA
 */

import { NextRequest, NextResponse } from "next/server";
import { getH2H } from "@/lib/football-api";
import { getTeamByTla } from "@/lib/teams-data";
import { withCache, CacheKeys, TTL } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const tlaA = req.nextUrl.searchParams.get("tlaA");
  const tlaB = req.nextUrl.searchParams.get("tlaB");

  if (!tlaA || !tlaB) {
    return NextResponse.json(
      { error: "tlaA and tlaB parameters required" },
      { status: 400 }
    );
  }

  const teamA = getTeamByTla(tlaA);
  const teamB = getTeamByTla(tlaB);

  if (!teamA) return NextResponse.json({ error: `Unknown team: ${tlaA}` }, { status: 404 });
  if (!teamB) return NextResponse.json({ error: `Unknown team: ${tlaB}` }, { status: 404 });

  try {
    const h2h = await withCache(
      CacheKeys.h2h(teamA.footballDataId, teamB.footballDataId),
      TTL.H2H,
      () => getH2H(teamA.footballDataId, teamB.footballDataId)
    );

    return NextResponse.json({ teamA, teamB, h2h });
  } catch (err) {
    console.error("[/api/h2h] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch H2H data" },
      { status: 500 }
    );
  }
}
