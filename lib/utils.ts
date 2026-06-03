import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Match, MatchResult, WorldCupTeam } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Determine W/D/L result for a team in a given match
 */
export function getMatchResult(match: Match, teamId: number): MatchResult | null {
  const { home, away } = match.score.fullTime;
  if (home === null || away === null) return null;

  const isHome = match.homeTeam.id === teamId;
  const teamGoals = isHome ? home : away;
  const oppGoals = isHome ? away : home;

  if (teamGoals > oppGoals) return "W";
  if (teamGoals === oppGoals) return "D";
  return "L";
}

/**
 * Format a date string to a readable format
 */
export function formatMatchDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Calculate age from date of birth string
 */
export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Get CSS color class for a match result badge
 */
export function getResultColor(result: MatchResult): string {
  switch (result) {
    case "W": return "bg-emerald-100 text-emerald-800";
    case "D": return "bg-amber-100 text-amber-800";
    case "L": return "bg-red-100 text-red-800";
  }
}

/**
 * Get confederation full name
 */
export function getConfederationName(conf: WorldCupTeam["confederation"]): string {
  const names: Record<WorldCupTeam["confederation"], string> = {
    UEFA: "Europe",
    CONMEBOL: "South America",
    CONCACAF: "North/Central America",
    CAF: "Africa",
    AFC: "Asia",
    OFC: "Oceania",
  };
  return names[conf];
}

/**
 * Sort players by position for squad display
 */
const POSITION_ORDER = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
export function sortPlayersByPosition<T extends { position: string }>(
  players: T[]
): T[] {
  return [...players].sort(
    (a, b) =>
      POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position)
  );
}
