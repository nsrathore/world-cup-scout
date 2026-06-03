/**
 * GET /api/fixtures?tla=BRA&limit=10
 */

import { NextRequest, NextResponse } from "next/server";
import { getTeamFixtures } from "@/lib/football-api";
import { getTeamByTla } from "@/lib/teams-data";
import { withCache, CacheKeys, TTL } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const tla = req.nextUrl.searchParams.get("tla");
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "10"), 20);

  if (!tla) {
    return NextResponse.json({ error: "tla parameter required" }, { status: 400 });
  }

  const team = getTeamByTla(tla);
  if (!team) {
    return NextResponse.json({ error: `Unknown team: ${tla}` }, { status: 404 });
  }

  try {
    const fixtures = await withCache(
      CacheKeys.fixtures(team.footballDataId),
      TTL.FIXTURES,
      () => getTeamFixtures(team.footballDataId, limit)
    );

    return NextResponse.json({ team, fixtures });
  } catch (err) {
    console.error("[/api/fixtures] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch fixtures" },
      { status: 500 }
    );
  }
}
