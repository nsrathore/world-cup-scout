"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  type Variants,
} from "framer-motion";
import { WorldCupTeam, Match, MatchResult } from "@/types";
import { cn, formatMatchDate, calculateAge, sortPlayersByPosition } from "@/lib/utils";
import AIScoutChat from "@/components/AIScoutChat";
import StatRadar, { computeRadarStats } from "@/components/StatRadar";
import { FormBadge, StatBar } from "@/components/StatsComponents";
import { Skeleton, SkeletonText } from "@/components/Skeleton";

// ─── Animation constants ────────────────────────────────────────────────────

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const STAGGER: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// ─── Animated count-up helper ────────────────────────────────────────────────

function useCountUp(target: number) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 100, damping: 20 });
  const [value, setValue] = useState(0);

  useMotionValueEvent(spring, "change", (v) => setValue(Math.round(v)));

  useEffect(() => {
    mv.set(target);
  }, [target, mv]);

  return value;
}

function AnimatedCount({ target }: { target: number }) {
  const value = useCountUp(target);
  return <>{value}</>;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface MatchupClientProps {
  teamA: WorldCupTeam;
  teamB: WorldCupTeam;
}

type Tab = "overview" | "h2h" | "squad" | "chat";

interface FixturesData {
  fixtures: Match[];
}

interface H2HData {
  h2h: {
    teamA: { id: number; wins: number };
    teamB: { id: number; wins: number };
    draws: number;
    totalMatches: number;
    recentMatches: Match[];
  };
}

interface SquadData {
  squad: {
    players: { id: number; name: string; position: string; dateOfBirth: string; shirtNumber?: number }[];
    coach?: { name: string; nationality: string };
  };
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function MatchupClient({ teamA, teamB }: MatchupClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [fixturesA, setFixturesA] = useState<Match[]>([]);
  const [fixturesB, setFixturesB] = useState<Match[]>([]);
  const [h2hData, setH2HData] = useState<H2HData["h2h"] | null>(null);
  const [squadA, setSquadA] = useState<SquadData["squad"] | null>(null);
  const [squadB, setSquadB] = useState<SquadData["squad"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [fA, fB, h2h, sA, sB] = await Promise.allSettled([
          fetch(`/api/fixtures?tla=${teamA.tla}`).then((r) => r.json() as Promise<FixturesData>),
          fetch(`/api/fixtures?tla=${teamB.tla}`).then((r) => r.json() as Promise<FixturesData>),
          fetch(`/api/h2h?tlaA=${teamA.tla}&tlaB=${teamB.tla}`).then((r) => r.json() as Promise<H2HData>),
          fetch(`/api/squad?tla=${teamA.tla}`).then((r) => r.json() as Promise<SquadData>),
          fetch(`/api/squad?tla=${teamB.tla}`).then((r) => r.json() as Promise<SquadData>),
        ]);

        if (fA.status === "fulfilled") setFixturesA(fA.value.fixtures ?? []);
        if (fB.status === "fulfilled") setFixturesB(fB.value.fixtures ?? []);
        if (h2h.status === "fulfilled") setH2HData(h2h.value.h2h ?? null);
        if (sA.status === "fulfilled") setSquadA(sA.value.squad ?? null);
        if (sB.status === "fulfilled") setSquadB(sB.value.squad ?? null);
      } catch (err) {
        console.error("Failed to load matchup data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [teamA.tla, teamB.tla]);

  function getForm(fixtures: Match[], teamId: number): MatchResult[] {
    return fixtures.slice(0, 5).map((m) => {
      const { home, away } = m.score.fullTime;
      if (home === null || away === null) return "D";
      const isHome = m.homeTeam.id === teamId;
      const tg = isHome ? home : away;
      const og = isHome ? away : home;
      return tg > og ? "W" : tg === og ? "D" : "L";
    });
  }

  const formA = getForm(fixturesA, teamA.footballDataId);
  const formB = getForm(fixturesB, teamB.footballDataId);

  const goalsA =
    fixturesA.reduce((s, m) => {
      const isHome = m.homeTeam.id === teamA.footballDataId;
      return s + ((isHome ? m.score.fullTime.home : m.score.fullTime.away) ?? 0);
    }, 0) / Math.max(fixturesA.length, 1);

  const concededA =
    fixturesA.reduce((s, m) => {
      const isHome = m.homeTeam.id === teamA.footballDataId;
      return s + ((isHome ? m.score.fullTime.away : m.score.fullTime.home) ?? 0);
    }, 0) / Math.max(fixturesA.length, 1);

  const goalsB =
    fixturesB.reduce((s, m) => {
      const isHome = m.homeTeam.id === teamB.footballDataId;
      return s + ((isHome ? m.score.fullTime.home : m.score.fullTime.away) ?? 0);
    }, 0) / Math.max(fixturesB.length, 1);

  const concededB =
    fixturesB.reduce((s, m) => {
      const isHome = m.homeTeam.id === teamB.footballDataId;
      return s + ((isHome ? m.score.fullTime.away : m.score.fullTime.home) ?? 0);
    }, 0) / Math.max(fixturesB.length, 1);

  const radarA = computeRadarStats(teamA, goalsA, concededA, formA.filter((r) => r === "W").length);
  const radarB = computeRadarStats(teamB, goalsB, concededB, formB.filter((r) => r === "W").length);

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "h2h", label: "Head-to-head" },
    { id: "squad", label: "Squad" },
    { id: "chat", label: "⚡ AI Scout" },
  ];

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "var(--wc-black)", fontFamily: "'Noto Sans', sans-serif" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="border-b px-6 py-4 flex items-center gap-4"
        style={{ borderColor: "var(--wc-gray-700)" }}
      >
        <motion.button
          onClick={() => router.push("/")}
          className="text-sm font-['Space_Mono'] transition-colors hover:text-white"
          style={{ color: "var(--wc-gray-400)" }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: "var(--wc-gold)" }}
          >
            <span className="text-black text-xs font-bold">⚡</span>
          </div>
          <span className="font-bold tracking-tight" style={{ fontFamily: "'Aldrich', sans-serif" }}>
            FIFA World Cup 26™
          </span>
        </div>
      </header>

      {/* ── Matchup hero ────────────────────────────────────────────────────── */}
      <div className="border-b px-6 py-8" style={{ borderColor: "var(--wc-gray-700)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-6 items-center">

            {/* Team A — slides in from left */}
            <motion.div
              className="text-center"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <motion.div
                className="text-7xl mb-3"
                animate={{ rotate: [0, -3, 3, 0] }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
              >
                {teamA.flagEmoji}
              </motion.div>
              <h1
                className="text-3xl font-extrabold tracking-tight"
                style={{ fontFamily: "'Aldrich', sans-serif", letterSpacing: "-0.02em" }}
              >
                {teamA.name}
              </h1>
              <div className="text-sm mt-1 font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>
                FIFA #{teamA.fifaRanking} · {teamA.tla}
              </div>
              <div className="flex justify-center gap-1 mt-3">
                {formA.map((r, i) => <FormBadge key={i} result={r} size="sm" />)}
              </div>
            </motion.div>

            {/* VS center — fades + scales up */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            >
              <div
                className="text-5xl font-extrabold tracking-tighter mb-2"
                style={{ fontFamily: "'Aldrich', sans-serif", color: "var(--wc-gold)" }}
              >
                VS
              </div>
              <div className="text-xs font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>
                World Cup 2026
              </div>

              <AnimatePresence>
                {h2hData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4 rounded p-3 text-xs font-['Space_Mono'] border"
                    style={{ background: "var(--wc-gray-900)", borderColor: "var(--wc-gold)" }}
                  >
                    <div className="mb-1" style={{ color: "var(--wc-gray-400)" }}>
                      All-time record
                    </div>
                    <div className="flex justify-center gap-3">
                      <span style={{ color: "var(--wc-gold)" }}>{h2hData.teamA.wins}W</span>
                      <span style={{ color: "var(--wc-gray-400)" }}>{h2hData.draws}D</span>
                      <span style={{ color: "var(--wc-white)" }}>{h2hData.teamB.wins}W</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Team B — slides in from right */}
            <motion.div
              className="text-center"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <motion.div
                className="text-7xl mb-3"
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 0.6, delay: 0.55, ease: "easeInOut" }}
              >
                {teamB.flagEmoji}
              </motion.div>
              <h2
                className="text-3xl font-extrabold tracking-tight"
                style={{ fontFamily: "'Aldrich', sans-serif", letterSpacing: "-0.02em" }}
              >
                {teamB.name}
              </h2>
              <div className="text-sm mt-1 font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>
                FIFA #{teamB.fifaRanking} · {teamB.tla}
              </div>
              <div className="flex justify-center gap-1 mt-3">
                {formB.map((r, i) => <FormBadge key={i} result={r} size="sm" />)}
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────────── */}
      <div
        className="border-b px-6"
        style={{ background: "var(--wc-gray-900)", borderColor: "var(--wc-gray-700)" }}
      >
        <div className="max-w-5xl mx-auto flex gap-1 relative">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-4 py-3 text-sm font-bold transition-colors"
              style={{
                color: activeTab === tab.id ? "var(--wc-gold)" : "var(--wc-gray-400)",
                fontFamily: "'Aldrich', sans-serif",
              }}
            >
              {tab.label}
              {/* Sliding gold underline via layoutId */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--wc-gold)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >

            {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar */}
                <motion.div
                  className="rounded-2xl p-6 border"
                  style={{ background: "var(--wc-gray-900)", borderColor: "var(--wc-gray-700)" }}
                  transition={{ duration: 0.2 }}
                >
                  <h3
                    className="text-xs font-bold mb-4 font-['Space_Mono'] uppercase tracking-wider"
                    style={{ color: "var(--wc-gray-400)" }}
                  >
                    Stat comparison
                  </h3>
                  <StatRadar teamA={teamA} teamB={teamB} statsA={radarA} statsB={radarB} />
                </motion.div>

                {/* Key stats */}
                <motion.div
                  className="rounded-2xl p-6 border"
                  style={{ background: "var(--wc-gray-900)", borderColor: "var(--wc-gray-700)" }}
                  transition={{ duration: 0.2 }}
                >
                  <h3
                    className="text-xs font-bold mb-4 font-['Space_Mono'] uppercase tracking-wider"
                    style={{ color: "var(--wc-gray-400)" }}
                  >
                    Key metrics (last 10 matches)
                  </h3>
                  {loading ? (
                    <SkeletonText lines={4} />
                  ) : (
                    <div className="space-y-4">
                      <StatBar
                        label="Goals / game"
                        valueA={Math.round(goalsA * 100) / 100}
                        valueB={Math.round(goalsB * 100) / 100}
                        maxValue={4}
                        format={(v) => v.toFixed(2)}
                      />
                      <StatBar
                        label="Conceded / game"
                        valueA={Math.round(concededA * 100) / 100}
                        valueB={Math.round(concededB * 100) / 100}
                        maxValue={4}
                        format={(v) => v.toFixed(2)}
                      />
                      <StatBar
                        label="FIFA ranking"
                        valueA={Math.max(0, 100 - teamA.fifaRanking)}
                        valueB={Math.max(0, 100 - teamB.fifaRanking)}
                        maxValue={100}
                        format={() => ""}
                      />
                      <div className="pt-2">
                        <div
                          className="flex justify-between text-xs font-['Space_Mono'] mb-2"
                          style={{ color: "var(--wc-gray-400)" }}
                        >
                          <span>Recent form (last 5)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            {formA.map((r, i) => <FormBadge key={i} result={r} size="sm" />)}
                          </div>
                          <div className="flex gap-1">
                            {formB.map((r, i) => <FormBadge key={i} result={r} size="sm" />)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {/* ── H2H TAB ──────────────────────────────────────────────────── */}
            {activeTab === "h2h" && (
              <div className="space-y-6">
                {loading ? (
                  <SkeletonText lines={4} />
                ) : h2hData && h2hData.totalMatches > 0 ? (
                  <>
                    {/* Win count cards with animated numbers */}
                    <div className="grid grid-cols-3 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="rounded-2xl p-6 text-center border"
                        style={{
                          background: "rgba(255,219,0,0.08)",
                          borderColor: "rgba(255,219,0,0.3)",
                        }}
                      >
                        <div
                          className="text-4xl font-extrabold"
                          style={{ fontFamily: "'Aldrich', sans-serif", color: "var(--wc-gold)" }}
                        >
                          <AnimatedCount target={h2hData.teamA.wins} />
                        </div>
                        <div className="text-sm mt-1" style={{ color: "var(--wc-gray-400)" }}>
                          {teamA.name} wins
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl p-6 text-center border"
                        style={{ background: "var(--wc-gray-900)", borderColor: "var(--wc-gray-700)" }}
                      >
                        <div
                          className="text-4xl font-extrabold"
                          style={{ fontFamily: "'Aldrich', sans-serif", color: "var(--wc-gray-400)" }}
                        >
                          <AnimatedCount target={h2hData.draws} />
                        </div>
                        <div className="text-sm mt-1" style={{ color: "var(--wc-gray-400)" }}>
                          Draws
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="rounded-2xl p-6 text-center border"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          borderColor: "rgba(255,255,255,0.15)",
                        }}
                      >
                        <div
                          className="text-4xl font-extrabold"
                          style={{ fontFamily: "'Aldrich', sans-serif", color: "var(--wc-white)" }}
                        >
                          <AnimatedCount target={h2hData.teamB.wins} />
                        </div>
                        <div className="text-sm mt-1" style={{ color: "var(--wc-gray-400)" }}>
                          {teamB.name} wins
                        </div>
                      </motion.div>
                    </div>

                    {/* Recent encounters — staggered rows */}
                    <div>
                      <h3
                        className="text-xs font-bold mb-4 font-['Space_Mono'] uppercase tracking-wider"
                        style={{ color: "var(--wc-gray-400)" }}
                      >
                        Recent encounters
                      </h3>
                      <motion.div
                        className="space-y-2"
                        variants={STAGGER}
                        initial="hidden"
                        animate="visible"
                      >
                        {h2hData.recentMatches.map((match) => {
                          const { home, away } = match.score.fullTime;
                          return (
                            <motion.div
                              key={match.id}
                              variants={FADE_UP}
                              whileHover={{
                                x: 4,
                                backgroundColor: "rgba(255,255,255,0.07)",
                              }}
                              viewport={{ once: true }}
                              className="rounded px-4 py-3 flex items-center justify-between border cursor-default"
                              style={{
                                background: "var(--wc-gray-900)",
                                borderColor: "var(--wc-gray-700)",
                              }}
                            >
                              <div
                                className="text-xs font-['Space_Mono'] w-28"
                                style={{ color: "var(--wc-gray-400)" }}
                              >
                                {formatMatchDate(match.date)}
                              </div>
                              <div className="flex items-center gap-3 flex-1 justify-center">
                                <span className="text-sm font-bold">{match.homeTeam.name}</span>
                                <span
                                  className="font-bold text-lg"
                                  style={{ fontFamily: "'Aldrich', sans-serif", color: "var(--wc-white)" }}
                                >
                                  {home} – {away}
                                </span>
                                <span className="text-sm font-bold">{match.awayTeam.name}</span>
                              </div>
                              <div
                                className="text-xs w-28 text-right font-['Space_Mono']"
                                style={{ color: "var(--wc-gray-400)" }}
                              >
                                {match.competition}
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16" style={{ color: "var(--wc-gray-400)" }}>
                    <div className="text-4xl mb-4">🏟️</div>
                    <div className="font-['Space_Mono']">No H2H history found for these teams</div>
                    <div className="text-sm mt-2">They may not have met in recorded competitions</div>
                  </div>
                )}
              </div>
            )}

            {/* ── SQUAD TAB ─────────────────────────────────────────────────── */}
            {activeTab === "squad" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { team: teamA, squad: squadA },
                  { team: teamB, squad: squadB },
                ].map(({ team, squad }) => (
                  <div
                    key={team.tla}
                    className="rounded-2xl p-5 border"
                    style={{ background: "var(--wc-gray-900)", borderColor: "var(--wc-gray-700)" }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{team.flagEmoji}</span>
                      <div>
                        <h3 className="font-bold" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                          {team.name}
                        </h3>
                        {squad?.coach && (
                          <div
                            className="text-xs italic"
                            style={{
                              color: "var(--wc-gray-400)",
                              fontFamily: "'Noto Sans', sans-serif",
                            }}
                          >
                            Coach: {squad.coach.name}
                          </div>
                        )}
                      </div>
                    </div>

                    {loading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <Skeleton key={i} className="h-8 w-full rounded" />
                        ))}
                      </div>
                    ) : squad ? (
                      <motion.div
                        className="space-y-1"
                        variants={STAGGER}
                        initial="hidden"
                        animate="visible"
                      >
                        {sortPlayersByPosition(squad.players).map((p) => (
                          <motion.div
                            key={p.id}
                            variants={FADE_UP}
                            whileHover={{
                              x: 4,
                              backgroundColor: "rgba(255,255,255,0.04)",
                            }}
                            viewport={{ once: true }}
                            className="flex items-center justify-between py-1.5 rounded"
                            style={{ borderBottom: "1px solid var(--wc-gray-700)" }}
                          >
                            <div className="flex items-center gap-2">
                              {p.shirtNumber && (
                                <span
                                  className="text-[10px] w-5 font-['Space_Mono']"
                                  style={{ color: "var(--wc-gray-400)" }}
                                >
                                  {p.shirtNumber}
                                </span>
                              )}
                              <span className="text-sm">{p.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[10px] font-['Space_Mono']"
                                style={{ color: "var(--wc-gray-400)" }}
                              >
                                {calculateAge(p.dateOfBirth)}y
                              </span>
                              <motion.span
                                whileHover={{ scale: 1.1 }}
                                className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded font-['Space_Mono'] font-bold",
                                  p.position === "Goalkeeper" && "bg-amber-500/20 text-amber-400",
                                  p.position === "Defender" && "bg-blue-500/20 text-blue-400",
                                  p.position === "Midfielder" && "bg-purple-500/20 text-purple-400",
                                  p.position === "Forward" && "bg-emerald-600/20 text-emerald-400"
                                )}
                              >
                                {p.position?.slice(0, 3).toUpperCase()}
                              </motion.span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="text-sm font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>
                        Squad data unavailable — check API key
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── AI CHAT TAB ──────────────────────────────────────────────── */}
            {activeTab === "chat" && (
              <motion.div
                className="rounded-2xl p-6 h-[600px] flex flex-col"
                style={{ background: "var(--wc-gray-900)" }}
                animate={{
                  borderColor: [
                    "rgba(255,219,0,0.1)",
                    "rgba(255,219,0,0.3)",
                    "rgba(255,219,0,0.1)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                initial={{ border: "1px solid rgba(255,219,0,0.1)" }}
              >
                <div
                  className="flex items-center gap-2 mb-4 pb-4"
                  style={{ borderBottom: "1px solid var(--wc-gray-700)" }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--wc-gold)" }}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <span className="text-sm font-bold" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                    AI Scout
                  </span>
                  <span className="text-xs font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>
                    Claude claude-sonnet-4-6 + live data
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <AIScoutChat
                    teamATla={teamA.tla}
                    teamBTla={teamB.tla}
                    teamAName={teamA.name}
                    teamBName={teamB.name}
                    autoAnalyze={true}
                  />
                </div>
              </motion.div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
