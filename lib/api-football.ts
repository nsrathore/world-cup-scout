/**
 * api-football.com client (v3)
 * Free tier: 100 requests/day; no `last=N` param; queries by season only.
 * Docs: https://www.api-football.com/documentation-v3
 *
 * Used for national-team fixtures and H2H data.
 * football-data.org free tier silently scopes team matches to WC competitions
 * only, which returns 0 results until WC 2026 is played. This API has no such
 * restriction.
 */

import { Match } from "@/types";

const BASE_URL = "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY ?? "";

// ─── Raw API types ─────────────────────────────────────────────────────────

interface AFTeamInfo {
  id: number;
  name: string;
  logo: string;
}

interface AFGoals {
  home: number | null;
  away: number | null;
}

interface AFFixtureInfo {
  id: number;
  date: string;
  status: { short: string };
}

interface AFLeague {
  name: string;
}

interface AFFixtureEntry {
  fixture: AFFixtureInfo;
  league: AFLeague;
  teams: { home: AFTeamInfo; away: AFTeamInfo };
  goals: AFGoals;
  score: {
    halftime: AFGoals;
    fulltime: AFGoals;
  };
}

interface AFResponse {
  response: AFFixtureEntry[];
  errors: unknown;
  results: number;
}

// ─── Internal helpers ──────────────────────────────────────────────────────

async function fetchAF(endpoint: string): Promise<AFResponse> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": "v3.football.api-sports.io",
    },
    // Same revalidation window as the football-data client
    next: { revalidate: 21600 },
  });

  if (!res.ok) {
    throw new Error(`api-football error [${res.status}]: ${await res.text()}`);
  }
  return res.json() as Promise<AFResponse>;
}

const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);

/**
 * Normalize an api-football fixture to the shared Match interface.
 *
 * idMap: optional map of api-football team ID → football-data.org team ID.
 * We remap team IDs so that callers can still use `m.homeTeam.id === team.footballDataId`.
 */
function normalizeAFMatch(
  f: AFFixtureEntry,
  idMap: Map<number, number> = new Map()
): Match {
  const statusShort = f.fixture.status.short;
  let status: Match["status"] = "SCHEDULED";
  if (FINISHED_STATUSES.has(statusShort)) status = "FINISHED";
  else if (!["NS", "TBD", "PST", "CANC", "ABD", "AWD", "WO"].includes(statusShort)) {
    status = "LIVE";
  }

  const remapId = (id: number) => idMap.get(id) ?? id;

  return {
    id: f.fixture.id,
    date: f.fixture.date,
    homeTeam: {
      id: remapId(f.teams.home.id),
      name: f.teams.home.name,
      crest: f.teams.home.logo,
    },
    awayTeam: {
      id: remapId(f.teams.away.id),
      name: f.teams.away.name,
      crest: f.teams.away.logo,
    },
    score: {
      // Use f.goals for final score (most reliable); halftime from f.score
      fullTime: { home: f.goals.home, away: f.goals.away },
      halfTime: { home: f.score.halftime.home, away: f.score.halftime.away },
    },
    competition: f.league.name,
    status,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Fetch the most recent `limit` finished matches for a national team.
 *
 * @param apiFootballId  The team's api-football.com ID
 * @param footballDataId The team's football-data.org ID (used to remap match
 *                       team IDs so existing callers don't need updating)
 * @param limit          Number of matches to return (default 10)
 */
export async function getTeamFixturesAF(
  apiFootballId: number,
  footballDataId: number,
  limit = 10
): Promise<Match[]> {
  const idMap = new Map([[apiFootballId, footballDataId]]);
  const currentYear = new Date().getFullYear();

  // Primary season
  const primary = await fetchAF(
    `/fixtures?team=${apiFootballId}&season=${currentYear}`
  );
  let finished = primary.response.filter((f) =>
    FINISHED_STATUSES.has(f.fixture.status.short)
  );

  // If not enough results, pull previous year too
  if (finished.length < limit) {
    const prev = await fetchAF(
      `/fixtures?team=${apiFootballId}&season=${currentYear - 1}`
    );
    finished = [
      ...finished,
      ...prev.response.filter((f) => FINISHED_STATUSES.has(f.fixture.status.short)),
    ];
  }

  // Sort newest-first, slice
  finished.sort(
    (a, b) =>
      new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime()
  );

  return finished.slice(0, limit).map((f) => normalizeAFMatch(f, idMap));
}

/**
 * Fetch the full head-to-head history between two national teams.
 *
 * @param teamAApiId  api-football.com ID for team A
 * @param teamAFDId   football-data.org ID for team A (for remapping)
 * @param teamBApiId  api-football.com ID for team B
 * @param teamBFDId   football-data.org ID for team B (for remapping)
 */
export async function getH2HAF(
  teamAApiId: number,
  teamAFDId: number,
  teamBApiId: number,
  teamBFDId: number
) {
  const idMap = new Map([
    [teamAApiId, teamAFDId],
    [teamBApiId, teamBFDId],
  ]);

  // No season filter — returns the full historical record
  const data = await fetchAF(
    `/fixtures/headtohead?h2h=${teamAApiId}-${teamBApiId}`
  );

  const allH2H = data.response
    .filter((f) => FINISHED_STATUSES.has(f.fixture.status.short))
    .sort(
      (a, b) =>
        new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime()
    );

  let teamAWins = 0;
  let teamBWins = 0;
  let draws = 0;

  for (const f of allH2H) {
    const homeGoals = f.goals.home;
    const awayGoals = f.goals.away;
    if (homeGoals === null || awayGoals === null) continue;

    const homeIsA = f.teams.home.id === teamAApiId;
    if (homeGoals > awayGoals) {
      homeIsA ? teamAWins++ : teamBWins++;
    } else if (awayGoals > homeGoals) {
      homeIsA ? teamBWins++ : teamAWins++;
    } else {
      draws++;
    }
  }

  return {
    teamA: { id: teamAFDId, wins: teamAWins },
    teamB: { id: teamBFDId, wins: teamBWins },
    draws,
    totalMatches: allH2H.length,
    recentMatches: allH2H.slice(0, 5).map((f) => normalizeAFMatch(f, idMap)),
  };
}
