"use client";

import { motion } from "framer-motion";
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
    <motion.div
      className="w-full"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
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
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Noto Sans, sans-serif" }}>
                {value}
              </span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Historical World Cup appearances per team (up to 2022). Max = Brazil at 22.
const WC_APPEARANCES: Record<string, number> = {
  BRA: 22, GER: 20, ITA: 18, ARG: 18, MEX: 17, FRA: 16, ENG: 16,
  ESP: 16, BEL: 14, URU: 14, USA: 11, KOR: 11, SUI: 12, NED: 11,
  POR:  8, CRO:  7, DEN:  5, POL:  9, SRB: 13, COL:  6, JPN:  7,
  SEN:  3, MAR:  6, NGA:  7, CMR:  8, GHA:  4, EGY:  3, CIV:  3,
  ALG:  4, AUS:  5, IRN:  6, SAU:  6, QAT:  1, CAN:  2, ECU:  3,
  VEN:  0, UKR:  2, HUN:  9, AUT:  7, SCO:  8, SVK:  1, IRQ:  1,
  UZB:  0, NZL:  2, PAN:  1, JAM:  1, HON:  3,
};

/**
 * Convert raw team data to 0–100 radar scores
 */
export function computeRadarStats(
  team: WorldCupTeam,
  goalsPerGame: number,
  goalsConcededPerGame: number,
  formWins: number
): Record<string, number> {
  const appearances = WC_APPEARANCES[team.tla] ?? 0;
  return {
    attack:     Math.min(100, Math.round(goalsPerGame * 35)),
    defense:    Math.max(0,   Math.round(100 - goalsConcededPerGame * 30)),
    form:       Math.round((formWins / 5) * 100),
    ranking:    Math.max(0,   Math.round(100 - (team.fifaRanking - 1) * 1.1)),
    experience: Math.round((appearances / 22) * 100),
  };
}
