/**
 * GET /api/squad?tla=BRA
 * Proxy for football-data.org squad endpoint with caching
 */

import { NextRequest, NextResponse } from "next/server";
import { getSquad } from "@/lib/football-api";
import { getTeamByTla } from "@/lib/teams-data";
import { withCache, CacheKeys, TTL } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const tla = req.nextUrl.searchParams.get("tla");

  if (!tla) {
    return NextResponse.json({ error: "tla parameter required" }, { status: 400 });
  }

  const team = getTeamByTla(tla);
  if (!team) {
    return NextResponse.json({ error: `Unknown team: ${tla}` }, { status: 404 });
  }

  try {
    const squad = await withCache(
      CacheKeys.squad(team.footballDataId),
      TTL.SQUAD,
      () => getSquad(team.footballDataId)
    );

    return NextResponse.json({ team, squad });
  } catch (err) {
    console.error("[/api/squad] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch squad data" },
      { status: 500 }
    );
  }
}
