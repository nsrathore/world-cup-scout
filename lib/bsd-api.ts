/**
 * Bzzoiro Sports Data (BSD) API client
 * Base URL: https://sports.bzzoiro.com/api/v2/
 * Auth:     Authorization: Token <BSD_API_KEY>
 * Free tier: no rate limits, no daily cap
 * Docs:     https://sports.bzzoiro.com/docs/v2/
 *
 * Exports the same function signatures as the old football-api.ts so
 * callers only need an import-path change.
 */

import { Match } from "@/types";

const BSD_BASE = "https://sports.bzzoiro.com/api/v2";
const BSD_API_KEY = process.env.BSD_API_KEY ?? "";

// ─── Internal fetch helper ─────────────────────────────────────────────────

async function fetchBSD<T>(endpoint: string): Promise<T> {
  const url = `${BSD_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Token ${BSD_API_KEY}`,
    },
    next: { revalidate: 21600 },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BSD API error [${res.status}]: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ─── Raw BSD types ─────────────────────────────────────────────────────────

interface BSDEvent {
  id: number;
  event_date: string;
  status: string;
  home_team: string;
  home_team_id: number;
  away_team: string;
  away_team_id: number;
  home_score: number | null;
  away_score: number | null;
  home_score_ht: number | null;
  away_score_ht: number | null;
  league_name: string;
  home_team_logo: string;
  away_team_logo: string;
}

interface BSDEventsResponse {
  results: BSDEvent[];
  count?: number;
}

interface BSDSquadPlayer {
  id: number;
  name: string;
  position: string;
  date_of_birth: string;
  nationality: string;
  shirt_number: number | null;
  club: string;
}

interface BSDSquadResponse {
  team_id: number;
  team_name: string;
  players: BSDSquadPlayer[];
}

interface BSDEventStatsSide {
  possession_pct?: number | null;
  pass_accuracy_pct?: number | null;
  shots_on_target?: number | null;
}

interface BSDEventStats {
  home?: BSDEventStatsSide | null;
  away?: BSDEventStatsSide | null;
}

interface BSDPlayerStats {
  id: number;
  name: string;
  position: string;
  goals: number;
  assists: number;
  rating: string | null;
  appearances: number;
  team_name: string;
}

interface BSDPlayersResponse {
  results: BSDPlayerStats[];
  count?: number;
}

// ─── Normalization helpers ─────────────────────────────────────────────────

function normalizeStatus(status: string): Match["status"] {
  switch (status.toLowerCase()) {
    case "finished":    return "FINISHED";
    case "inprogress":  return "LIVE";
    default:            return "SCHEDULED";
  }
}

function normalizePosition(
  pos: string
): "Goalkeeper" | "Defender" | "Midfielder" | "Forward" {
  switch (pos) {
    case "GK": return "Goalkeeper";
    case "DF": return "Defender";
    case "MF": return "Midfielder";
    case "FW": return "Forward";
    case "Goalkeeper":
    case "Defender":
    case "Midfielder":
    case "Forward":
      return pos as "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
    default:
      // Unknown position — safe fallback
      return "Midfielder";
  }
}

function normalizeBSDEvent(e: BSDEvent): Match {
  return {
    id: e.id,
    date: e.event_date,
    homeTeam: {
      id: e.home_team_id,
      name: e.home_team,
      crest: e.home_team_logo,
    },
    awayTeam: {
      id: e.away_team_id,
      name: e.away_team,
      crest: e.away_team_logo,
    },
    score: {
      fullTime: { home: e.home_score,    away: e.away_score    },
      halfTime: { home: e.home_score_ht, away: e.away_score_ht },
    },
    competition: e.league_name,
    status: normalizeStatus(e.status),
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Fetch the World Cup squad for a team by their BSD team ID.
 * Endpoint: GET /api/v2/worldcup/squads/{bsdTeamId}/
 */
export async function getSquad(bsdTeamId: number) {
  const data = await fetchBSD<BSDSquadResponse>(`/worldcup/squads/${bsdTeamId}/`);

  return {
    teamId: bsdTeamId,
    teamName: data.team_name,
    coach: undefined, // BSD WC squad endpoint does not include coach data
    players: (data.players ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      position: normalizePosition(p.position),
      dateOfBirth: p.date_of_birth,
      nationality: p.nationality,
      shirtNumber: p.shirt_number ?? undefined,
    })),
  };
}

/**
 * Fetch the last `limit` finished matches for a team.
 * Endpoint: GET /api/v2/events/?team_id={bsdTeamId}&status=finished&limit=20
 */
export async function getTeamFixtures(
  bsdTeamId: number,
  limit = 10
): Promise<Match[]> {
  const data = await fetchBSD<BSDEventsResponse>(
    `/events/?team_id=${bsdTeamId}&status=finished&limit=20`
  );

  return (data.results ?? [])
    .sort(
      (a, b) =>
        new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
    )
    .slice(0, limit)
    .map(normalizeBSDEvent);
}

/**
 * Fetch the head-to-head record between two teams.
 * BSD has no dedicated H2H endpoint — we fetch team A's matches and filter.
 * Falls back to team B's matches if fewer than 3 H2H games found.
 * Endpoints: GET /api/v2/events/?team_id={id}&status=finished&limit=200
 */
export async function getH2H(teamABsdId: number, teamBBsdId: number) {
  const isH2H = (e: BSDEvent) =>
    (e.home_team_id === teamABsdId && e.away_team_id === teamBBsdId) ||
    (e.home_team_id === teamBBsdId && e.away_team_id === teamABsdId);

  const dataA = await fetchBSD<BSDEventsResponse>(
    `/events/?team_id=${teamABsdId}&status=finished&limit=200`
  );

  let allH2H = (dataA.results ?? []).filter(isH2H);

  // If we found fewer than 3, also check team B's history and merge
  if (allH2H.length < 3) {
    const dataB = await fetchBSD<BSDEventsResponse>(
      `/events/?team_id=${teamBBsdId}&status=finished&limit=200`
    );
    const seen = new Set(allH2H.map((e) => e.id));
    for (const e of (dataB.results ?? []).filter(isH2H)) {
      if (!seen.has(e.id)) {
        allH2H.push(e);
        seen.add(e.id);
      }
    }
  }

  // Sort newest-first
  allH2H.sort(
    (a, b) =>
      new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  let teamAWins = 0;
  let teamBWins = 0;
  let draws = 0;

  for (const e of allH2H) {
    const h = e.home_score;
    const a = e.away_score;
    if (h === null || a === null) continue;

    const homeIsA = e.home_team_id === teamABsdId;
    if (h > a) {
      homeIsA ? teamAWins++ : teamBWins++;
    } else if (a > h) {
      homeIsA ? teamBWins++ : teamAWins++;
    } else {
      draws++;
    }
  }

  return {
    teamA: { id: teamABsdId, wins: teamAWins },
    teamB: { id: teamBBsdId, wins: teamBWins },
    draws,
    totalMatches: allH2H.length,
    recentMatches: allH2H.slice(0, 5).map(normalizeBSDEvent),
  };
}

/**
 * Fetch aggregated possession, pass-accuracy, and shot stats for a team
 * by averaging per-match stats across the last 5 finished matches.
 *
 * Endpoints:
 *   GET /api/v2/events/?team_id={id}&status=finished&limit=5
 *   GET /api/v2/events/{eventId}/stats/   (×5, capped, Promise.allSettled)
 *
 * Returns all-nulls if no per-match data is available — does not throw.
 */
export async function getBSDTeamAggStats(bsdTeamId: number): Promise<{
  possession: number | null;
  passAccuracy: number | null;
  shotsPerGame: number | null;
}> {
  const empty = { possession: null, passAccuracy: null, shotsPerGame: null };

  try {
    const data = await fetchBSD<BSDEventsResponse>(
      `/events/?team_id=${bsdTeamId}&status=finished&limit=5`
    );
    const recent = (data.results ?? []).slice(0, 5);
    if (recent.length === 0) return empty;

    const statResults = await Promise.allSettled(
      recent.map((e) =>
        fetchBSD<BSDEventStats>(`/events/${e.id}/stats/`).then((stats) => ({
          stats,
          isHome: e.home_team_id === bsdTeamId,
        }))
      )
    );

    const possessions: number[] = [];
    const passAccuracies: number[] = [];
    const shots: number[] = [];

    for (const result of statResults) {
      if (result.status !== "fulfilled") continue;
      const { stats, isHome } = result.value;
      const side = isHome ? stats.home : stats.away;
      if (!side) continue;
      if (side.possession_pct != null)    possessions.push(side.possession_pct);
      if (side.pass_accuracy_pct != null) passAccuracies.push(side.pass_accuracy_pct);
      if (side.shots_on_target != null)   shots.push(side.shots_on_target);
    }

    const avg = (arr: number[]): number | null =>
      arr.length > 0
        ? Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10
        : null;

    return {
      possession:   avg(possessions),
      passAccuracy: avg(passAccuracies),
      shotsPerGame: avg(shots),
    };
  } catch {
    return empty;
  }
}

/**
 * Fetch the top `limit` players for a team by goals + rating.
 * Endpoint: GET /api/v2/players/?team_id={bsdTeamId}&limit=50
 */
export async function getBSDTopPlayers(
  bsdTeamId: number,
  limit = 5
): Promise<
  Array<{
    id: number;
    name: string;
    position: string;
    goals: number;
    assists: number;
    rating: number | null;
    appearances: number;
    club: string;
  }>
> {
  const data = await fetchBSD<BSDPlayersResponse>(
    `/players/?team_id=${bsdTeamId}&limit=50`
  );

  const players = (data.results ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    position: normalizePosition(p.position),
    goals: p.goals ?? 0,
    assists: p.assists ?? 0,
    rating: p.rating ? parseFloat(p.rating) : null,
    appearances: p.appearances ?? 0,
    club: p.team_name ?? "",
  }));

  players.sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    return (b.rating ?? 0) - (a.rating ?? 0);
  });

  return players.slice(0, limit);
}
