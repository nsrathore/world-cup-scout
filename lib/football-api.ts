/**
 * football-data.org API client
 * Free tier: 10 calls/min, covers competitions, teams, squads, fixtures
 * Docs: https://www.football-data.org/documentation/quickstart
 */

const BASE_URL = "https://api.football-data.org/v4";
const API_KEY = process.env.FOOTBALL_DATA_API_KEY ?? "";

// World Cup 2026 competition ID on football-data.org
export const WORLD_CUP_2026_ID = 2000;

async function fetchFootballData<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      "X-Auth-Token": API_KEY,
      "Content-Type": "application/json",
    },
    // Next.js cache: revalidate every 6 hours
    next: { revalidate: 21600 },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(
      `football-data.org API error [${res.status}]: ${err}`
    );
  }

  return res.json() as Promise<T>;
}

// ─── Raw API types (subset) ────────────────────────────────────────────────

interface FDTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

interface FDPlayer {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
  shirtNumber: number | null;
}

interface FDSquadResponse {
  id: number;
  name: string;
  squad: FDPlayer[];
  coach: { name: string; nationality: string } | null;
}

interface FDMatch {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: FDTeam;
  awayTeam: FDTeam;
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
  competition: { name: string };
}

interface FDMatchesResponse {
  matches: FDMatch[];
}

interface FDH2HResponse {
  aggregates: {
    homeTeam: { id: number; name: string; wins: number; draws: number; losses: number };
    awayTeam: { id: number; name: string; wins: number; draws: number; losses: number };
  };
  matches: FDMatch[];
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Get 23-man squad for a team by their football-data.org team ID
 */
export async function getSquad(teamId: number) {
  const data = await fetchFootballData<FDSquadResponse>(`/teams/${teamId}`);

  return {
    teamId: data.id,
    teamName: data.name,
    coach: data.coach ?? undefined,
    players: (data.squad ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position as "Goalkeeper" | "Defender" | "Midfielder" | "Forward",
      dateOfBirth: p.dateOfBirth,
      nationality: p.nationality,
      shirtNumber: p.shirtNumber ?? undefined,
    })),
  };
}

/**
 * Get last N finished matches for a team
 */
export async function getTeamFixtures(teamId: number, limit = 10) {
  const data = await fetchFootballData<FDMatchesResponse>(
    `/teams/${teamId}/matches?status=FINISHED`
  );

  // Free tier ignores `limit` param and returns oldest-first — sort newest-first then slice
  const sorted = [...data.matches].sort(
    (a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
  );
  return sorted.slice(0, limit).map(normalizeMatch);
}

/**
 * Get head-to-head record between two teams
 * Uses a recent match of one team and fetches h2h from that match ID
 */
export async function getH2H(teamAId: number, teamBId: number) {
  const data = await fetchFootballData<FDMatchesResponse>(
    `/teams/${teamAId}/matches?status=FINISHED`
  );

  const isH2H = (m: FDMatch) =>
    (m.homeTeam.id === teamAId && m.awayTeam.id === teamBId) ||
    (m.homeTeam.id === teamBId && m.awayTeam.id === teamAId);

  let allH2H = data.matches.filter(isH2H);

  // If nothing found from team A's side, try team B's match history
  if (allH2H.length === 0) {
    const dataB = await fetchFootballData<FDMatchesResponse>(
      `/teams/${teamBId}/matches?status=FINISHED`
    );
    allH2H = dataB.matches.filter(isH2H);
  }

  // Sort newest-first
  allH2H.sort(
    (a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
  );

  let teamAWins = 0;
  let teamBWins = 0;
  let draws = 0;

  for (const match of allH2H) {
    const { home, away } = match.score.fullTime;
    if (home === null || away === null) continue;

    const homeIsA = match.homeTeam.id === teamAId;
    if (home > away) {
      homeIsA ? teamAWins++ : teamBWins++;
    } else if (away > home) {
      homeIsA ? teamBWins++ : teamAWins++;
    } else {
      draws++;
    }
  }

  return {
    teamA: { id: teamAId, wins: teamAWins },
    teamB: { id: teamBId, wins: teamBWins },
    draws,
    totalMatches: allH2H.length,
    recentMatches: allH2H.slice(0, 5).map(normalizeMatch),
  };
}

/**
 * Get current World Cup standings if available
 */
export async function getWorldCupStandings() {
  try {
    const data = await fetchFootballData<{ standings: unknown[] }>(
      `/competitions/${WORLD_CUP_2026_ID}/standings`
    );
    return data.standings;
  } catch {
    return null; // Tournament may not have started yet
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function normalizeMatch(m: FDMatch) {
  return {
    id: m.id,
    date: m.utcDate,
    homeTeam: {
      id: m.homeTeam.id,
      name: m.homeTeam.name,
      crest: m.homeTeam.crest,
    },
    awayTeam: {
      id: m.awayTeam.id,
      name: m.awayTeam.name,
      crest: m.awayTeam.crest,
    },
    score: m.score,
    competition: m.competition.name,
    status: m.status as "SCHEDULED" | "LIVE" | "FINISHED",
  };
}
