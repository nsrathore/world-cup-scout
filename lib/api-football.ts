/**
 * api-football.com client (v3)
 * Free tier: 100 requests/day
 * Docs: https://www.api-football.com/documentation-v3
 *
 * Optimized to use the minimum number of API calls per matchup:
 *   - 1 request per team for fixtures (no fallback season)
 *   - 1-2 requests for H2H (2 seasons max, second only if first is thin)
 *
 * A single matchup page load costs 3-4 requests max (vs 9 before).
 * With Redis caching at 6h TTL, repeated views cost 0 additional requests.
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
      "x-apisports-key": API_KEY,
      "x-rapidapi-host": "v3.football.api-sports.io",
    },
    next: { revalidate: 21600 },
  });

  if (!res.ok) {
    throw new Error(`api-football error [${res.status}]: ${await res.text()}`);
  }

  const data = (await res.json()) as AFResponse;

  // api-football returns HTTP 200 even for auth/rate-limit errors — check body
  const { errors } = data;
  if (
    errors &&
    (Array.isArray(errors)
      ? errors.length > 0
      : Object.keys(errors as Record<string, unknown>).length > 0)
  ) {
    throw new Error(`api-football API error: ${JSON.stringify(errors)}`);
  }

  return data;
}

const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);

/**
 * Normalize an api-football fixture to the shared Match interface.
 *
 * idMap: optional map of api-football team ID → football-data.org team ID.
 * We remap IDs so callers can still compare against team.footballDataId.
 */
function normalizeAFMatch(
  f: AFFixtureEntry,
  idMap: Map<number, number> = new Map()
): Match {
  const statusShort = f.fixture.status.short;
  let status: Match["status"] = "SCHEDULED";
  if (FINISHED_STATUSES.has(statusShort)) {
    status = "FINISHED";
  } else if (
    !["NS", "TBD", "PST", "CANC", "ABD", "AWD", "WO"].includes(statusShort)
  ) {
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
      fullTime: { home: f.goals.home, away: f.goals.away },
      halfTime: {
        home: f.score.halftime.home,
        away: f.score.halftime.away,
      },
    },
    competition: f.league.name,
    status,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Fetch the most recent `limit` finished matches for a national team.
 *
 * COST: 1 request (current season only — no fallback).
 * The previous-season fallback was removed because it could double the cost.
 * If the current season has no results yet (early in the year), the caller
 * will receive an empty array — the UI handles this gracefully.
 *
 * @param apiFootballId  The team's api-football.com ID
 * @param footballDataId The team's football-data.org ID (used to remap IDs)
 * @param limit          Number of matches to return (default 10)
 */
export async function getTeamFixturesAF(
  apiFootballId: number,
  footballDataId: number,
  limit = 10
): Promise<Match[]> {
  const idMap = new Map([[apiFootballId, footballDataId]]);
  const currentYear = new Date().getFullYear();

  const data = await fetchAF(
    `/fixtures?team=${apiFootballId}&season=${currentYear}`
  );

  const finished = data.response
    .filter((f) => FINISHED_STATUSES.has(f.fixture.status.short))
    .sort(
      (a, b) =>
        new Date(b.fixture.date).getTime() -
        new Date(a.fixture.date).getTime()
    )
    .slice(0, limit);

  return finished.map((f) => normalizeAFMatch(f, idMap));
}

/**
 * Fetch head-to-head history between two national teams.
 *
 * COST: 1 request normally; 2 requests if the first season returns fewer
 * than 3 finished matches (we look back one additional year).
 * Previously this fired 5 parallel requests — now capped at 2 max.
 *
 * Strategy: start from currentYear - 1 (the most recently completed season)
 * rather than currentYear, since mid-year there may be zero completed H2H
 * matches in the current season. Fall back to currentYear - 2 only if thin.
 *
 * @param teamAApiId  api-football.com ID for team A
 * @param teamAFDId   football-data.org ID for team A (for ID remapping)
 * @param teamBApiId  api-football.com ID for team B
 * @param teamBFDId   football-data.org ID for team B (for ID remapping)
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

  const currentYear = new Date().getFullYear();

  // Fetch the most recently completed season first (currentYear - 1)
  const primary = await fetchAF(
    `/fixtures/headtohead?h2h=${teamAApiId}-${teamBApiId}&season=${
      currentYear - 1
    }`
  );

  let allEntries = primary.response.filter((f) =>
    FINISHED_STATUSES.has(f.fixture.status.short)
  );

  // Only fetch a second season if the first returned fewer than 3 matches.
  // This keeps the typical cost at 1 request while still providing coverage
  // for pairs that didn't meet in the most recent season.
  if (allEntries.length < 3) {
    const prev = await fetchAF(
      `/fixtures/headtohead?h2h=${teamAApiId}-${teamBApiId}&season=${
        currentYear - 2
      }`
    );
    const prevFinished = prev.response.filter((f) =>
      FINISHED_STATUSES.has(f.fixture.status.short)
    );

    // Deduplicate by fixture ID before merging
    const seen = new Set(allEntries.map((f) => f.fixture.id));
    for (const f of prevFinished) {
      if (!seen.has(f.fixture.id)) {
        allEntries.push(f);
        seen.add(f.fixture.id);
      }
    }
  }

  // Sort newest-first
  allEntries.sort(
    (a, b) =>
      new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime()
  );

  let teamAWins = 0;
  let teamBWins = 0;
  let draws = 0;

  for (const f of allEntries) {
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
    totalMatches: allEntries.length,
    recentMatches: allEntries
      .slice(0, 5)
      .map((f) => normalizeAFMatch(f, idMap)),
  };
}