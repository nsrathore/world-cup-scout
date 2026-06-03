"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { WORLD_CUP_TEAMS } from "@/lib/teams-data";
import { WorldCupTeam } from "@/types";
import { cn, getConfederationName } from "@/lib/utils";

const CONFEDERATIONS: WorldCupTeam["confederation"][] = [
  "UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC",
];

/** Subtle geometric "26" background tile — squares + quarter-circles at ~3% opacity */
const GeometricPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    style={{ opacity: 0.035 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="wc26-tile" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        {/* Small square */}
        <rect x="2" y="2" width="8" height="8" fill="white" />
        {/* Quarter circle top-right */}
        <path d="M20 2 A10 10 0 0 1 30 12 L20 12 Z" fill="white" />
        {/* Small square bottom-left */}
        <rect x="2" y="28" width="8" height="8" fill="white" />
        {/* Quarter circle bottom-right */}
        <path d="M22 30 A8 8 0 0 0 30 38 L30 30 Z" fill="white" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#wc26-tile)" />
  </svg>
);

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
      if (teamB?.tla === team.tla) return;
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
    <div className="min-h-screen text-white" style={{ background: "var(--wc-black)", fontFamily: "'Noto Sans', sans-serif" }}>

      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: "var(--wc-gray-700)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: "var(--wc-gold)" }}
          >
            <span className="text-black text-sm font-bold">⚡</span>
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "'Aldrich', sans-serif" }}
          >
            FIFA World Cup 26™
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-['Space_Mono']"
            style={{ background: "var(--wc-gray-800)", color: "var(--wc-gray-400)", border: "1px solid var(--wc-gray-700)" }}
          >
            SCOUT AI
          </span>
        </div>
        <div className="text-xs font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>
          Powered by Claude claude-sonnet-4-6
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero with geometric background */}
        <div className="mb-12 text-center relative overflow-hidden rounded-2xl py-14 px-6" style={{ background: "var(--wc-gray-900)" }}>
          <GeometricPattern />
          <div className="relative z-10">
            <h1
              className="text-5xl font-extrabold mb-4"
              style={{ fontFamily: "'Aldrich', sans-serif", letterSpacing: "-0.02em" }}
            >
              World Cup
              <span style={{ color: "var(--wc-gold)" }}> Matchup</span>
              <br />
              Intelligence
            </h1>
            <p style={{ color: "var(--wc-gray-400)", fontFamily: "'Noto Sans', sans-serif" }} className="text-lg max-w-xl mx-auto">
              AI-powered tactical intelligence —{" "}
              <span style={{ color: "var(--wc-white)" }} className="font-semibold">WE ARE 26</span>
            </p>
          </div>
        </div>

        {/* Selection slots */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {/* Team A slot */}
          <button
            onClick={() => setSelectingSlot("A")}
            className="relative rounded-2xl border p-6 text-left transition-all duration-200"
            style={{
              borderColor: selectingSlot === "A" ? "var(--wc-gold)" : "var(--wc-gray-700)",
              background: selectingSlot === "A" ? "rgba(255,219,0,0.08)" : "var(--wc-gray-900)",
              opacity: teamA ? 1 : 0.7,
            }}
          >
            <div className="text-xs mb-3 font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>TEAM A</div>
            {teamA ? (
              <>
                <div className="text-4xl mb-2">{teamA.flagEmoji}</div>
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: "'Aldrich', sans-serif" }}
                >
                  {teamA.name}
                </div>
                <div className="text-sm mt-0.5" style={{ color: "var(--wc-gray-400)" }}>
                  FIFA #{teamA.fifaRanking} · {teamA.tla}
                </div>
              </>
            ) : (
              <div className="text-sm mt-2" style={{ color: "var(--wc-gray-400)" }}>Click a team below →</div>
            )}
            {selectingSlot === "A" && (
              <div
                className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--wc-gold)" }}
              />
            )}
          </button>

          {/* VS */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div
                className="text-4xl font-extrabold tracking-tighter"
                style={{ fontFamily: "'Aldrich', sans-serif", color: "var(--wc-gold)" }}
              >
                VS
              </div>
              {teamA && teamB && (
                <button
                  onClick={analyze}
                  className="mt-4 px-6 py-3 rounded font-bold text-sm transition-colors"
                  style={{
                    background: "var(--wc-gold)",
                    color: "var(--wc-black)",
                    fontFamily: "'Aldrich', sans-serif",
                    border: "2px solid var(--wc-gold)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--wc-gold-dark)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--wc-gold-dark)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--wc-gold)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--wc-gold)";
                  }}
                >
                  Analyze →
                </button>
              )}
            </div>
          </div>

          {/* Team B slot */}
          <button
            onClick={() => setSelectingSlot("B")}
            className="relative rounded-2xl border p-6 text-left transition-all duration-200"
            style={{
              borderColor: selectingSlot === "B" ? "var(--wc-gold)" : "var(--wc-gray-700)",
              background: selectingSlot === "B" ? "rgba(255,219,0,0.08)" : "var(--wc-gray-900)",
              opacity: teamB ? 1 : 0.7,
            }}
          >
            <div className="text-xs mb-3 font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>TEAM B</div>
            {teamB ? (
              <>
                <div className="text-4xl mb-2">{teamB.flagEmoji}</div>
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: "'Aldrich', sans-serif" }}
                >
                  {teamB.name}
                </div>
                <div className="text-sm mt-0.5" style={{ color: "var(--wc-gray-400)" }}>
                  FIFA #{teamB.fifaRanking} · {teamB.tla}
                </div>
              </>
            ) : (
              <div className="text-sm mt-2" style={{ color: "var(--wc-gray-400)" }}>Click a team below →</div>
            )}
            {selectingSlot === "B" && (
              <div
                className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--wc-gold)" }}
              />
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
            className="flex-1 rounded px-4 py-2.5 text-sm text-white placeholder-[#888] outline-none transition-colors"
            style={{
              background: "var(--wc-gray-800)",
              border: "1px solid var(--wc-gray-700)",
              fontFamily: "'Noto Sans', sans-serif",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,219,0,0.5)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--wc-gray-700)")}
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setConfFilter("ALL")}
              className="px-3 py-2 rounded text-xs font-bold transition-colors"
              style={{
                background: confFilter === "ALL" ? "var(--wc-gold)" : "var(--wc-gray-800)",
                color: confFilter === "ALL" ? "var(--wc-black)" : "var(--wc-gray-400)",
                border: `1px solid ${confFilter === "ALL" ? "var(--wc-gold)" : "var(--wc-gray-700)"}`,
              }}
            >
              All
            </button>
            {CONFEDERATIONS.map((c) => (
              <button
                key={c}
                onClick={() => setConfFilter(c)}
                className="px-3 py-2 rounded text-xs font-bold transition-colors"
                style={{
                  background: confFilter === c ? "var(--wc-gold)" : "var(--wc-gray-800)",
                  color: confFilter === c ? "var(--wc-black)" : "var(--wc-gray-400)",
                  border: `1px solid ${confFilter === c ? "var(--wc-gold)" : "var(--wc-gray-700)"}`,
                }}
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
                className="rounded border p-3 text-left transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: isSelectedA
                    ? "rgba(255,219,0,0.08)"
                    : isSelectedB
                    ? "rgba(255,255,255,0.05)"
                    : "var(--wc-gray-900)",
                  borderColor: isSelectedA
                    ? "var(--wc-gold)"
                    : isSelectedB
                    ? "var(--wc-white)"
                    : "var(--wc-gray-700)",
                }}
              >
                <div className="text-2xl mb-1">{team.flagEmoji}</div>
                <div className="text-xs font-bold truncate">{team.name}</div>
                <div className="text-[10px] font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>
                  #{team.fifaRanking}
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 font-['Space_Mono'] text-sm" style={{ color: "var(--wc-gray-400)" }}>
            No teams found for &quot;{search}&quot;
          </div>
        )}
      </main>
    </div>
  );
}
