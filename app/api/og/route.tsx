// GET /api/og?teamA=BRA&teamB=FRA
// Returns a 1200x630 PNG share card for the matchup
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getTeamByTla } from "@/lib/teams-data";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const teamATla = req.nextUrl.searchParams.get("teamA") ?? "BRA";
  const teamBTla = req.nextUrl.searchParams.get("teamB") ?? "FRA";

  const teamA = getTeamByTla(teamATla);
  const teamB = getTeamByTla(teamBTla);

  if (!teamA || !teamB) {
    return new Response("Invalid teams", { status: 400 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a0f1c",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ color: "#FFDB00", fontSize: 24, marginBottom: 40,
                      letterSpacing: 4, textTransform: "uppercase" }}>
          World Cup 2026 · Scout AI
        </div>

        {/* Teams row */}
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          {/* Team A */}
          <div style={{ display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 100 }}>{teamA.flagEmoji}</div>
            <div style={{ color: "#ffffff", fontSize: 48, fontWeight: 700 }}>
              {teamA.name}
            </div>
            <div style={{ color: "#888888", fontSize: 20 }}>
              FIFA #{teamA.fifaRanking}
            </div>
          </div>

          {/* VS */}
          <div style={{ color: "#FFDB00", fontSize: 72, fontWeight: 900 }}>
            VS
          </div>

          {/* Team B */}
          <div style={{ display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 100 }}>{teamB.flagEmoji}</div>
            <div style={{ color: "#ffffff", fontSize: 48, fontWeight: 700 }}>
              {teamB.name}
            </div>
            <div style={{ color: "#888888", fontSize: 20 }}>
              FIFA #{teamB.fifaRanking}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ color: "#444444", fontSize: 18, marginTop: 48 }}>
          AI-powered tactical analysis · scout-ai.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
