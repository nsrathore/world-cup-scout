"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { WORLD_CUP_TEAMS } from "@/lib/teams-data";
import { WorldCupTeam } from "@/types";
import { cn, getConfederationName } from "@/lib/utils";

const CONFEDERATIONS: WorldCupTeam["confederation"][] = [
  "UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC",
];

export default function TeamSelector() {
  const router = useRouter();
  const [teamA, setTeamA] = useState<WorldCupTeam | null>(null);
  const [teamB, setTeamB] = useState<WorldCupTeam | null>(null);
  const [search, setSearch] = useState("");
  const [confFilter, setConfFilter] = useState<WorldCupTeam["confederation"] | "ALL">("ALL");
  const [selectingSlot, setSelectingSlot] = useState<"A" | "B">("A");

  const filtered = useMemo(() => {
    return WORLD_CUP_TEAMS.filter((t) => {
      const matchesSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.tla.toLowerCase().includes(search.toLowerCase());
      const matchesConf = confFilter === "ALL" || t.confederation === confFilter;
      return matchesSearch && matchesConf;
    });
  }, [search, confFilter]);

  function selectTeam(team: WorldCupTeam) {
    if (selectingSlot === "A") {
      if (teamB?.tla === team.tla) return; // prevent same team
      setTeamA(team);
      setSelectingSlot("B");
    } else {
      if (teamA?.tla === team.tla) return;
      setTeamB(team);
    }
  }

  function analyze() {
    if (!teamA || !teamB) return;
    router.push(`/matchup/${teamA.tla}/${teamB.tla}`);
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white font-['Syne',sans-serif]">
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');`}</style>

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00ff87] flex items-center justify-center">
            <span className="text-black text-sm font-bold">⚡</span>
          </div>
          <span className="text-lg font-bold tracking-tight">Scout AI</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-['Space_Mono']">
            WC 2026
          </span>
        </div>
        <div className="text-xs text-white/40 font-['Space_Mono']">
          Powered by Claude claude-sonnet-4-6
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1
            className="text-5xl font-extrabold tracking-tighter mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            World Cup
            <span className="text-[#00ff87]"> Matchup</span>
            <br />
            Intelligence
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            AI-powered tactical analysis for every fixture. Select two nations to
            get live stats, head-to-head history, and a Claude-generated scout report.
          </p>
        </div>

        {/* Selection slots */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {/* Team A slot */}
          <button
            onClick={() => setSelectingSlot("A")}
            className={cn(
              "relative rounded-2xl border p-6 text-left transition-all duration-200",
              selectingSlot === "A"
                ? "border-[#00ff87] bg-[#00ff87]/5"
                : "border-white/10 bg-white/5 hover:border-white/20",
              teamA ? "" : "opacity-60"
            )}
          >
            <div className="text-xs text-white/40 font-['Space_Mono'] mb-3">TEAM A</div>
            {teamA ? (
              <>
                <div className="text-4xl mb-2">{teamA.flagEmoji}</div>
                <div className="text-xl font-bold">{teamA.name}</div>
                <div className="text-sm text-white/50">
                  FIFA #{teamA.fifaRanking} · {teamA.tla}
                </div>
              </>
            ) : (
              <div className="text-white/30 text-sm mt-2">Click a team below →</div>
            )}
            {selectingSlot === "A" && (
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00ff87] animate-pulse" />
            )}
          </button>

          {/* VS */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-white/20 tracking-tighter">VS</div>
              {teamA && teamB && (
                <button
                  onClick={analyze}
                  className="mt-4 px-6 py-3 bg-[#00ff87] text-black rounded-xl font-bold text-sm hover:bg-[#00e87a] transition-colors"
                >
                  Analyze →
                </button>
              )}
            </div>
          </div>

          {/* Team B slot */}
          <button
            onClick={() => setSelectingSlot("B")}
            className={cn(
              "relative rounded-2xl border p-6 text-left transition-all duration-200",
              selectingSlot === "B"
                ? "border-[#00ff87] bg-[#00ff87]/5"
                : "border-white/10 bg-white/5 hover:border-white/20",
              teamB ? "" : "opacity-60"
            )}
          >
            <div className="text-xs text-white/40 font-['Space_Mono'] mb-3">TEAM B</div>
            {teamB ? (
              <>
                <div className="text-4xl mb-2">{teamB.flagEmoji}</div>
                <div className="text-xl font-bold">{teamB.name}</div>
                <div className="text-sm text-white/50">
                  FIFA #{teamB.fifaRanking} · {teamB.tla}
                </div>
              </>
            ) : (
              <div className="text-white/30 text-sm mt-2">Click a team below →</div>
            )}
            {selectingSlot === "B" && (
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00ff87] animate-pulse" />
            )}
          </button>
        </div>

        {/* Search + filter */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#00ff87]/50 transition-colors font-['Space_Mono']"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setConfFilter("ALL")}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-bold transition-colors",
                confFilter === "ALL"
                  ? "bg-[#00ff87] text-black"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              )}
            >
              All
            </button>
            {CONFEDERATIONS.map((c) => (
              <button
                key={c}
                onClick={() => setConfFilter(c)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-bold transition-colors",
                  confFilter === c
                    ? "bg-[#00ff87] text-black"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Teams grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((team) => {
            const isSelectedA = teamA?.tla === team.tla;
            const isSelectedB = teamB?.tla === team.tla;
            const isSelected = isSelectedA || isSelectedB;

            return (
              <button
                key={team.tla}
                onClick={() => selectTeam(team)}
                disabled={
                  (selectingSlot === "A" && teamB?.tla === team.tla) ||
                  (selectingSlot === "B" && teamA?.tla === team.tla)
                }
                className={cn(
                  "rounded-xl border p-3 text-left transition-all duration-150 group",
                  isSelectedA &&
                    "border-[#00ff87] bg-[#00ff87]/10",
                  isSelectedB &&
                    "border-blue-400 bg-blue-400/10",
                  !isSelected &&
                    "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
                  "disabled:opacity-30 disabled:cursor-not-allowed"
                )}
              >
                <div className="text-2xl mb-1">{team.flagEmoji}</div>
                <div className="text-xs font-bold truncate">{team.name}</div>
                <div className="text-[10px] text-white/40 font-['Space_Mono']">
                  #{team.fifaRanking}
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-white/30 py-12 font-['Space_Mono'] text-sm">
            No teams found for &quot;{search}&quot;
          </div>
        )}
      </main>
    </div>
  );
}
