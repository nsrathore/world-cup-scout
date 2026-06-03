"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { WorldCupTeam } from "@/types";

interface StatRadarProps {
  teamA: WorldCupTeam;
  teamB: WorldCupTeam;
  // Stats on 0–100 scale
  statsA: Record<string, number>;
  statsB: Record<string, number>;
}

const RADAR_AXES = [
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "form", label: "Form" },
  { key: "ranking", label: "Ranking" },
  { key: "experience", label: "Experience" },
];

export default function StatRadar({ teamA, teamB, statsA, statsB }: StatRadarProps) {
  const data = RADAR_AXES.map(({ key, label }) => ({
    axis: label,
    [teamA.tla]: statsA[key] ?? 50,
    [teamB.tla]: statsB[key] ?? 50,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "#888888", fontSize: 12, fontFamily: "Noto Sans, sans-serif" }}
          />
          <Radar
            name={teamA.name}
            dataKey={teamA.tla}
            stroke="#FFDB00"
            fill="#FFDB00"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Radar
            name={teamB.name}
            dataKey={teamB.tla}
            stroke="#FFFFFF"
            fill="#FFFFFF"
            fillOpacity={0.12}
            strokeWidth={2}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Noto Sans, sans-serif" }}>{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Convert raw team data to 0-100 radar scores
 * FIFA ranking: #1 = 100, #200 = 0
 */
export function computeRadarStats(
  team: WorldCupTeam,
  goalsPerGame: number,
  goalsConcededPerGame: number,
  formWins: number // wins in last 5
): Record<string, number> {
  return {
    attack: Math.min(100, Math.round(goalsPerGame * 35)),
    defense: Math.max(0, Math.round(100 - goalsConcededPerGame * 30)),
    form: Math.round((formWins / 5) * 100),
    ranking: Math.max(0, Math.round(100 - (team.fifaRanking - 1) * 1.2)),
    experience: 65, // Placeholder — can enhance with WC appearances data
  };
}
