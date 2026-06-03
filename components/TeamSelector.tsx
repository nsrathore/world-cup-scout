"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  type Variants,
} from "framer-motion";
import { WORLD_CUP_TEAMS } from "@/lib/teams-data";
import { WorldCupTeam } from "@/types";
import { cn, getConfederationName } from "@/lib/utils";

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

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Counts up from 0 → target using a spring animation */
function useCountUp(target: number) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 18 });
  const [value, setValue] = useState(0);

  useMotionValueEvent(spring, "change", (v) => setValue(Math.round(v)));

  useEffect(() => {
    mv.set(target);
  }, [target, mv]);

  return value;
}

/** Pill counter in the stats ticker */
function StatPill({ label, target }: { label: string; target: number }) {
  const count = useCountUp(target);
  return (
    <motion.div
      variants={FADE_UP}
      className="px-4 py-1.5 rounded-full text-sm font-bold font-['Space_Mono'] border"
      style={{
        background: "var(--wc-gray-900)",
        borderColor: "rgba(255,219,0,0.35)",
        color: "var(--wc-white)",
      }}
    >
      <span style={{ color: "var(--wc-gold)" }}>{count}</span>{" "}
      <span style={{ color: "var(--wc-gray-400)", fontWeight: 400 }}>{label}</span>
    </motion.div>
  );
}

// ─── Geometric "26" background pattern ──────────────────────────────────────

const GeometricPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    style={{ opacity: 0.035 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="wc26-tile" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect x="2" y="2" width="8" height="8" fill="white" />
        <path d="M20 2 A10 10 0 0 1 30 12 L20 12 Z" fill="white" />
        <rect x="2" y="28" width="8" height="8" fill="white" />
        <path d="M22 30 A8 8 0 0 0 30 38 L30 30 Z" fill="white" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#wc26-tile)" />
  </svg>
);

// ─── Team slot ───────────────────────────────────────────────────────────────

interface SlotProps {
  label: string;
  team: WorldCupTeam | null;
  active: boolean;
  onClick: () => void;
}

function TeamSlot({ label, team, active, onClick }: SlotProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-full rounded-2xl border p-6 text-left will-change-transform overflow-hidden"
      style={{
        borderColor: active ? "var(--wc-gold)" : "var(--wc-gray-700)",
        background: active ? "rgba(255,219,0,0.08)" : "var(--wc-gray-900)",
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Breathing border overlay — only when slot is empty */}
      {!team && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: "1px solid transparent" }}
          animate={{
            borderColor: [
              "rgba(255,255,255,0.05)",
              "rgba(255,219,0,0.25)",
              "rgba(255,255,255,0.05)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      )}

      <div className="text-xs mb-3 font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>
        {label}
      </div>

      <AnimatePresence mode="wait">
        {team ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-4xl mb-2">{team.flagEmoji}</div>
            <div className="text-xl font-bold" style={{ fontFamily: "'Aldrich', sans-serif" }}>
              {team.name}
            </div>
            <div className="text-sm mt-0.5" style={{ color: "var(--wc-gray-400)" }}>
              FIFA #{team.fifaRanking} · {team.tla}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-sm mt-2" style={{ color: "var(--wc-gray-400)" }}>
              Click a team below →
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active pulse dot */}
      {active && (
        <motion.div
          className="absolute top-3 right-3 w-2 h-2 rounded-full"
          style={{ background: "var(--wc-gold)" }}
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.button>
  );
}

// ─── Confederation filter ────────────────────────────────────────────────────

const CONFEDERATIONS: WorldCupTeam["confederation"][] = [
  "UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC",
];

interface ConfPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function ConfPill({ label, active, onClick }: ConfPillProps) {
  return (
    <motion.button
      variants={FADE_UP}
      onClick={onClick}
      className="relative px-3 py-2 rounded text-xs font-bold overflow-hidden will-change-transform"
      style={{ border: `1px solid ${active ? "var(--wc-gold)" : "var(--wc-gray-700)"}` }}
      whileTap={{ scale: 0.95 }}
    >
      {active && (
        <motion.div
          layoutId="activeConf"
          className="absolute inset-0 rounded"
          style={{ background: "var(--wc-gold)" }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
      <span
        className="relative"
        style={{ zIndex: 1, color: active ? "var(--wc-black)" : "var(--wc-gray-400)" }}
      >
        {label}
      </span>
    </motion.button>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

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

  // Suppress unused import warning — getConfederationName is exported from utils
  void getConfederationName;

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "var(--wc-black)", fontFamily: "'Noto Sans', sans-serif" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "var(--wc-gray-700)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: "var(--wc-gold)" }}
          >
            <span className="text-black text-sm font-bold">⚡</span>
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Aldrich', sans-serif" }}>
            FIFA World Cup 26™
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-['Space_Mono']"
            style={{
              background: "var(--wc-gray-800)",
              color: "var(--wc-gray-400)",
              border: "1px solid var(--wc-gray-700)",
            }}
          >
            SCOUT AI
          </span>
        </div>
        <div className="text-xs font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>
          Powered by Claude claude-sonnet-4-6
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <div
          className="mb-12 text-center relative overflow-hidden rounded-2xl py-14 px-6"
          style={{ background: "var(--wc-gray-900)" }}
        >
          <GeometricPattern />
          <motion.div
            className="relative z-10"
            variants={STAGGER}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={FADE_UP}
              className="text-5xl font-extrabold mb-4"
              style={{ fontFamily: "'Aldrich', sans-serif", letterSpacing: "-0.02em" }}
            >
              World Cup
              <span style={{ color: "var(--wc-gold)" }}> Matchup</span>
              <br />
              Intelligence
            </motion.h1>

            <motion.p
              variants={FADE_UP}
              className="text-lg max-w-xl mx-auto mb-8"
              style={{ color: "var(--wc-gray-400)" }}
            >
              AI-powered tactical intelligence —{" "}
              <span style={{ color: "var(--wc-white)" }} className="font-semibold">
                WE ARE 26
              </span>
            </motion.p>

            {/* Stats ticker */}
            <motion.div
              variants={STAGGER}
              className="flex justify-center gap-3 flex-wrap"
            >
              <StatPill label="Nations" target={48} />
              <StatPill label="Matches" target={104} />
              <StatPill label="Host Countries" target={3} />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Team selection slots ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <TeamSlot
            label="TEAM A"
            team={teamA}
            active={selectingSlot === "A"}
            onClick={() => setSelectingSlot("A")}
          />

          {/* VS / Analyze center */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div
                className="text-4xl font-extrabold tracking-tighter"
                style={{ fontFamily: "'Aldrich', sans-serif", color: "var(--wc-gold)" }}
              >
                VS
              </div>
              <AnimatePresence>
                {teamA && teamB && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={analyze}
                    className="mt-4 px-6 py-3 rounded font-bold text-sm will-change-transform"
                    style={{
                      background: "var(--wc-gold)",
                      color: "var(--wc-black)",
                      fontFamily: "'Aldrich', sans-serif",
                      border: "2px solid var(--wc-gold)",
                    }}
                  >
                    Analyze →
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <TeamSlot
            label="TEAM B"
            team={teamB}
            active={selectingSlot === "B"}
            onClick={() => setSelectingSlot("B")}
          />
        </div>

        {/* ── Search + confederation filter ───────────────────────────────────── */}
        <div className="flex gap-3 mb-6 flex-col sm:flex-row">
          {/* Search input with icon + clear */}
          <div className="relative flex-1">
            {/* Magnifying glass icon */}
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "var(--wc-gray-400)" }}
            >
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded text-sm text-white outline-none transition-colors"
              style={{
                background: "var(--wc-gray-800)",
                border: "1px solid var(--wc-gray-700)",
                fontFamily: "'Noto Sans', sans-serif",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,219,0,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--wc-gray-700)")}
            />

            {/* Clear button — fades in when there's text */}
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm leading-none"
                  style={{ color: "var(--wc-gray-400)" }}
                >
                  ×
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Confederation pills */}
          <motion.div
            className="flex gap-2 flex-wrap"
            variants={STAGGER}
            initial="hidden"
            animate="visible"
          >
            <ConfPill
              label="All"
              active={confFilter === "ALL"}
              onClick={() => setConfFilter("ALL")}
            />
            {CONFEDERATIONS.map((c) => (
              <ConfPill
                key={c}
                label={c}
                active={confFilter === c}
                onClick={() => setConfFilter(c)}
              />
            ))}
          </motion.div>
        </div>

        {/* ── Teams grid ──────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${confFilter}-${search}`}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
            variants={STAGGER}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((team) => {
              const isSelectedA = teamA?.tla === team.tla;
              const isSelectedB = teamB?.tla === team.tla;
              const isSelected = isSelectedA || isSelectedB;
              const isDisabled =
                (selectingSlot === "A" && teamB?.tla === team.tla) ||
                (selectingSlot === "B" && teamA?.tla === team.tla);

              return (
                <motion.button
                  key={team.tla}
                  variants={FADE_UP}
                  onClick={() => selectTeam(team)}
                  disabled={isDisabled}
                  className="relative rounded border p-3 text-left will-change-transform"
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
                    opacity: isDisabled ? 0.25 : 1,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                  }}
                  whileHover={
                    !isDisabled
                      ? { y: -3, borderColor: isSelected ? undefined : "rgba(255,219,0,0.5)" }
                      : {}
                  }
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                >
                  {/* Flag */}
                  <motion.div
                    className="text-2xl mb-1"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {team.flagEmoji}
                  </motion.div>

                  <div className="text-xs font-bold truncate">{team.name}</div>
                  <div
                    className="text-[10px] font-['Space_Mono']"
                    style={{ color: "var(--wc-gray-400)" }}
                  >
                    #{team.fifaRanking}
                  </div>

                  {/* Selected checkmark overlay */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{
                          background: isSelectedA ? "var(--wc-gold)" : "var(--wc-white)",
                        }}
                      >
                        <span
                          className="text-[8px] font-bold"
                          style={{ color: "var(--wc-black)" }}
                        >
                          ✓
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 font-['Space_Mono'] text-sm"
            style={{ color: "var(--wc-gray-400)" }}
          >
            No teams found for &quot;{search}&quot;
          </motion.div>
        )}
      </main>
    </div>
  );
}
