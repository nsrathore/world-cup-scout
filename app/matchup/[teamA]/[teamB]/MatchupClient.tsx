"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorldCupTeam, Match, MatchResult } from "@/types";
import { cn, formatMatchDate, calculateAge, sortPlayersByPosition } from "@/lib/utils";
import AIScoutChat from "@/components/AIScoutChat";
import StatRadar, { computeRadarStats } from "@/components/StatRadar";
import { FormBadge, StatBar } from "@/components/StatsComponents";

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

  // Derive form strings
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

  const goalsA = fixturesA.reduce((s, m) => {
    const isHome = m.homeTeam.id === teamA.footballDataId;
    return s + ((isHome ? m.score.fullTime.home : m.score.fullTime.away) ?? 0);
  }, 0) / Math.max(fixturesA.length, 1);

  const concededA = fixturesA.reduce((s, m) => {
    const isHome = m.homeTeam.id === teamA.footballDataId;
    return s + ((isHome ? m.score.fullTime.away : m.score.fullTime.home) ?? 0);
  }, 0) / Math.max(fixturesA.length, 1);

  const goalsB = fixturesB.reduce((s, m) => {
    const isHome = m.homeTeam.id === teamB.footballDataId;
    return s + ((isHome ? m.score.fullTime.home : m.score.fullTime.away) ?? 0);
  }, 0) / Math.max(fixturesB.length, 1);

  const concededB = fixturesB.reduce((s, m) => {
    const isHome = m.homeTeam.id === teamB.footballDataId;
    return s + ((isHome ? m.score.fullTime.away : m.score.fullTime.home) ?? 0);
  }, 0) / Math.max(fixturesB.length, 1);

  const radarA = computeRadarStats(teamA, goalsA, concededA, formA.filter((r) => r === "W").length);
  const radarB = computeRadarStats(teamB, goalsB, concededB, formB.filter((r) => r === "W").length);

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "h2h", label: "Head-to-head" },
    { id: "squad", label: "Squad" },
    { id: "chat", label: "AI Scout" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white font-['Syne',sans-serif]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');`}</style>

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push("/")}
          className="text-white/40 hover:text-white transition-colors text-sm font-['Space_Mono']"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#00ff87] flex items-center justify-center">
            <span className="text-black text-xs font-bold">⚡</span>
          </div>
          <span className="font-bold tracking-tight">Scout AI</span>
        </div>
      </header>

      {/* Matchup hero */}
      <div className="border-b border-white/10 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-6 items-center">
            {/* Team A */}
            <div className="text-center">
              <div className="text-6xl mb-3">{teamA.flagEmoji}</div>
              <h1 className="text-2xl font-extrabold tracking-tight">{teamA.name}</h1>
              <div className="text-sm text-white/40 font-['Space_Mono'] mt-1">
                FIFA #{teamA.fifaRanking} · {teamA.tla}
              </div>
              <div className="flex justify-center gap-1 mt-3">
                {formA.map((r, i) => <FormBadge key={i} result={r} size="sm" />)}
              </div>
            </div>

            {/* VS center */}
            <div className="text-center">
              <div className="text-5xl font-extrabold text-white/20 tracking-tighter mb-2">VS</div>
              <div className="text-xs text-white/30 font-['Space_Mono']">World Cup 2026</div>
              {h2hData && (
                <div className="mt-4 bg-white/5 rounded-xl p-3 text-xs font-['Space_Mono']">
                  <div className="text-white/40 mb-1">All-time record</div>
                  <div className="flex justify-center gap-3">
                    <span className="text-[#00ff87]">{h2hData.teamA.wins}W</span>
                    <span className="text-white/40">{h2hData.draws}D</span>
                    <span className="text-blue-400">{h2hData.teamB.wins}W</span>
                  </div>
                </div>
              )}
            </div>

            {/* Team B */}
            <div className="text-center">
              <div className="text-6xl mb-3">{teamB.flagEmoji}</div>
              <h2 className="text-2xl font-extrabold tracking-tight">{teamB.name}</h2>
              <div className="text-sm text-white/40 font-['Space_Mono'] mt-1">
                FIFA #{teamB.fifaRanking} · {teamB.tla}
              </div>
              <div className="flex justify-center gap-1 mt-3">
                {formB.map((r, i) => <FormBadge key={i} result={r} size="sm" />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 px-6">
        <div className="max-w-5xl mx-auto flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-bold transition-colors border-b-2",
                activeTab === tab.id
                  ? "text-[#00ff87] border-[#00ff87]"
                  : "text-white/40 border-transparent hover:text-white/70"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white/50 mb-4 font-['Space_Mono'] uppercase tracking-wider">
                Stat comparison
              </h3>
              <StatRadar
                teamA={teamA}
                teamB={teamB}
                statsA={radarA}
                statsB={radarB}
              />
            </div>

            {/* Key stats */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white/50 mb-4 font-['Space_Mono'] uppercase tracking-wider">
                Key metrics (last 10 matches)
              </h3>
              {loading ? (
                <div className="text-white/30 text-sm font-['Space_Mono']">Loading stats...</div>
              ) : (
                <>
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
                    <div className="flex justify-between text-xs text-white/40 font-['Space_Mono'] mb-2">
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
                </>
              )}
            </div>
          </div>
        )}

        {/* H2H TAB */}
        {activeTab === "h2h" && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-white/30 font-['Space_Mono'] text-sm">Loading H2H data...</div>
            ) : h2hData && h2hData.totalMatches > 0 ? (
              <>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#00ff87]/10 border border-[#00ff87]/20 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-extrabold text-[#00ff87]">{h2hData.teamA.wins}</div>
                    <div className="text-sm text-white/50 mt-1">{teamA.name} wins</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-extrabold text-white/60">{h2hData.draws}</div>
                    <div className="text-sm text-white/50 mt-1">Draws</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-extrabold text-blue-400">{h2hData.teamB.wins}</div>
                    <div className="text-sm text-white/50 mt-1">{teamB.name} wins</div>
                  </div>
                </div>

                {/* Recent encounters */}
                <div>
                  <h3 className="text-sm font-bold text-white/50 mb-4 font-['Space_Mono'] uppercase tracking-wider">
                    Recent encounters
                  </h3>
                  <div className="space-y-2">
                    {h2hData.recentMatches.map((match) => {
                      const { home, away } = match.score.fullTime;
                      return (
                        <div
                          key={match.id}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between"
                        >
                          <div className="text-xs text-white/40 font-['Space_Mono'] w-28">
                            {formatMatchDate(match.date)}
                          </div>
                          <div className="flex items-center gap-3 flex-1 justify-center">
                            <span className="text-sm font-bold">{match.homeTeam.name}</span>
                            <span className="font-['Space_Mono'] font-bold text-lg text-white/70">
                              {home} – {away}
                            </span>
                            <span className="text-sm font-bold">{match.awayTeam.name}</span>
                          </div>
                          <div className="text-xs text-white/30 w-28 text-right font-['Space_Mono']">
                            {match.competition}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-white/30">
                <div className="text-4xl mb-4">🏟️</div>
                <div className="font-['Space_Mono']">No H2H history found for these teams</div>
                <div className="text-sm mt-2">They may not have met in recorded competitions</div>
              </div>
            )}
          </div>
        )}

        {/* SQUAD TAB */}
        {activeTab === "squad" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { team: teamA, squad: squadA },
              { team: teamB, squad: squadB },
            ].map(({ team, squad }) => (
              <div key={team.tla} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{team.flagEmoji}</span>
                  <div>
                    <h3 className="font-bold">{team.name}</h3>
                    {squad?.coach && (
                      <div className="text-xs text-white/40 font-['Space_Mono']">
                        Coach: {squad.coach.name}
                      </div>
                    )}
                  </div>
                </div>
                {loading ? (
                  <div className="text-white/30 text-sm font-['Space_Mono']">Loading squad...</div>
                ) : squad ? (
                  <div className="space-y-1">
                    {sortPlayersByPosition(squad.players).map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          {p.shirtNumber && (
                            <span className="text-[10px] w-5 text-white/30 font-['Space_Mono']">
                              {p.shirtNumber}
                            </span>
                          )}
                          <span className="text-sm">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/30 font-['Space_Mono']">
                            {calculateAge(p.dateOfBirth)}y
                          </span>
                          <span
                            className={cn(
                              "text-[9px] px-1.5 py-0.5 rounded font-['Space_Mono'] font-bold",
                              p.position === "Goalkeeper" && "bg-amber-500/20 text-amber-400",
                              p.position === "Defender" && "bg-blue-500/20 text-blue-400",
                              p.position === "Midfielder" && "bg-purple-500/20 text-purple-400",
                              p.position === "Forward" && "bg-[#00ff87]/20 text-[#00ff87]"
                            )}
                          >
                            {p.position?.slice(0, 3).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/30 text-sm font-['Space_Mono']">
                    Squad data unavailable — check API key
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* AI CHAT TAB */}
        {activeTab === "chat" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse" />
              <span className="text-sm font-bold">AI Scout</span>
              <span className="text-xs text-white/40 font-['Space_Mono']">
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
          </div>
        )}
      </div>
    </div>
  );
}
