// ─── Team & Country ──────────────────────────────────────────────────────────

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string; // Three-letter abbreviation e.g. "BRA"
  crest: string; // URL to team crest/flag image
  countryCode: string;
  fifaRanking?: number;
  group?: string;
}

export interface Country {
  name: { common: string; official: string };
  cca2: string;
  cca3: string;
  flags: { svg: string; png: string };
  population: number;
  region: string;
}

// ─── Player ──────────────────────────────────────────────────────────────────

export interface Player {
  id: number;
  name: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  dateOfBirth: string;
  nationality: string;
  shirtNumber?: number;
  club?: string;
  stats?: PlayerStats;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  appearances: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
  xG?: number; // Expected goals
  xA?: number; // Expected assists
  rating?: number; // Average match rating
}

// ─── Match & Form ────────────────────────────────────────────────────────────

export type MatchResult = "W" | "D" | "L";

export interface Match {
  id: number;
  date: string;
  homeTeam: { id: number; name: string; crest: string };
  awayTeam: { id: number; name: string; crest: string };
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
  competition: string;
  status: "SCHEDULED" | "LIVE" | "FINISHED";
}

export interface TeamForm {
  teamId: number;
  recentMatches: Match[];
  formString: MatchResult[]; // e.g. ["W","W","D","L","W"]
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
}

// ─── Head-to-Head ─────────────────────────────────────────────────────────────

export interface H2HRecord {
  teamA: { id: number; name: string; wins: number };
  teamB: { id: number; name: string; wins: number };
  draws: number;
  totalMatches: number;
  recentMatches: Match[];
}

// ─── Squad ───────────────────────────────────────────────────────────────────

export interface Squad {
  teamId: number;
  teamName: string;
  players: Player[];
  coach?: { name: string; nationality: string };
}

// ─── Matchup (aggregated) ────────────────────────────────────────────────────

export interface MatchupData {
  teamA: Team;
  teamB: Team;
  squadA: Squad;
  squadB: Squad;
  formA: TeamForm;
  formB: TeamForm;
  h2h: H2HRecord;
  stats: TeamComparisonStats;
}

export interface TeamComparisonStats {
  teamA: TeamStats;
  teamB: TeamStats;
}

export interface TeamStats {
  teamId: number;
  possession: number; // avg %
  goalsPerGame: number;
  goalsConcededPerGame: number;
  shotsPerGame: number;
  passAccuracy: number;
  xGPerGame?: number;
  fifaRanking?: number;
}

// ─── AI Analysis ─────────────────────────────────────────────────────────────

export interface AnalysisRequest {
  teamA: string; // Team TLA e.g. "BRA"
  teamB: string; // Team TLA e.g. "FRA"
  question?: string; // Optional follow-up question from chat
  conversationHistory?: ChatMessage[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AnalysisStreamChunk {
  type: "text" | "tool_call" | "tool_result" | "done" | "error";
  content?: string;
  toolName?: string;
  toolInput?: unknown;
  toolResult?: unknown;
  error?: string;
}

// ─── Tool Definitions (Claude) ───────────────────────────────────────────────

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
  };
}

// ─── World Cup 2026 Teams ────────────────────────────────────────────────────

export interface WorldCupTeam {
  tla: string;
  name: string;
  group: string;
  footballDataId: number;
  apiFootballId: number;
  bsdTeamId: number;
  flagEmoji: string;
  fifaRanking: number;
  confederation: "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "AFC" | "OFC";
}
