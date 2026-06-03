/**
 * Tool definitions for the Claude agent.
 *
 * Each tool definition tells Claude:
 *   1. What the tool is called
 *   2. What it does (description)
 *   3. What parameters it expects (input_schema)
 *
 * When Claude decides to use a tool, it returns a `tool_use` block.
 * Your server then executes the actual function and sends back a `tool_result`.
 */

import { ToolDefinition } from "@/types";
import { getSquad, getTeamFixtures, getH2H } from "./football-api";
import { getTeamByTla } from "./teams-data";
import { withCache, CacheKeys, TTL } from "./cache";

// ─── Tool Definitions (sent to Claude on every request) ───────────────────

export const SCOUT_TOOLS: ToolDefinition[] = [
  {
    name: "get_squad",
    description:
      "Fetch the current 23-man squad for a national team, including player names, positions, ages, and club affiliations. Use this to analyze team depth, preferred formations, and key players.",
    input_schema: {
      type: "object",
      properties: {
        team_tla: {
          type: "string",
          description:
            "Three-letter team abbreviation (e.g. 'BRA' for Brazil, 'FRA' for France, 'ENG' for England)",
        },
      },
      required: ["team_tla"],
    },
  },
  {
    name: "get_recent_form",
    description:
      "Get a team's last 10 match results including scores, opponents, and competition. Use this to assess current form, goal-scoring trends, and defensive stability.",
    input_schema: {
      type: "object",
      properties: {
        team_tla: {
          type: "string",
          description: "Three-letter team abbreviation",
        },
        limit: {
          type: "number",
          description: "Number of recent matches to fetch (default: 10, max: 20)",
        },
      },
      required: ["team_tla"],
    },
  },
  {
    name: "get_head_to_head",
    description:
      "Get the historical head-to-head record between two teams: wins, draws, losses, and recent encounters. Essential for understanding historical dominance and psychological edge.",
    input_schema: {
      type: "object",
      properties: {
        team_a_tla: {
          type: "string",
          description: "Three-letter abbreviation for team A",
        },
        team_b_tla: {
          type: "string",
          description: "Three-letter abbreviation for team B",
        },
      },
      required: ["team_a_tla", "team_b_tla"],
    },
  },
  {
    name: "get_team_stats",
    description:
      "Get aggregated statistics for a team: average possession, goals per game, goals conceded, shots on target, and FIFA ranking. Use this for tactical comparison.",
    input_schema: {
      type: "object",
      properties: {
        team_tla: {
          type: "string",
          description: "Three-letter team abbreviation",
        },
      },
      required: ["team_tla"],
    },
  },
];

// ─── Tool Handlers (what actually runs when Claude calls a tool) ───────────

export interface ToolInput {
  team_tla?: string;
  team_a_tla?: string;
  team_b_tla?: string;
  limit?: number;
}

export async function executeTool(
  toolName: string,
  input: ToolInput
): Promise<unknown> {
  switch (toolName) {
    case "get_squad": {
      const tla = input.team_tla!;
      const team = getTeamByTla(tla);
      if (!team) throw new Error(`Unknown team: ${tla}`);

      return withCache(
        CacheKeys.squad(team.footballDataId),
        TTL.SQUAD,
        () => getSquad(team.footballDataId)
      );
    }

    case "get_recent_form": {
      const tla = input.team_tla!;
      const team = getTeamByTla(tla);
      if (!team) throw new Error(`Unknown team: ${tla}`);
      const limit = Math.min(input.limit ?? 10, 20);

      const matches = await withCache(
        CacheKeys.fixtures(team.footballDataId),
        TTL.FIXTURES,
        () => getTeamFixtures(team.footballDataId, limit, team.apiFootballId)
      );

      // api-football fixtures have IDs remapped to footballDataId — comparison is always correct
      const teamFDId = team.footballDataId;

      // Derive form string
      const formString = matches.slice(0, 5).map((m) => {
        const { home, away } = m.score.fullTime;
        if (home === null || away === null) return "?";
        const isHome = m.homeTeam.id === teamFDId;
        const teamGoals = isHome ? home : away;
        const oppGoals = isHome ? away : home;
        if (teamGoals > oppGoals) return "W";
        if (teamGoals === oppGoals) return "D";
        return "L";
      });

      const goalsScored = matches.reduce((sum, m) => {
        const isHome = m.homeTeam.id === teamFDId;
        const g = isHome ? m.score.fullTime.home : m.score.fullTime.away;
        return sum + (g ?? 0);
      }, 0);

      const goalsConceded = matches.reduce((sum, m) => {
        const isHome = m.homeTeam.id === teamFDId;
        const g = isHome ? m.score.fullTime.away : m.score.fullTime.home;
        return sum + (g ?? 0);
      }, 0);

      return {
        teamId: team.footballDataId,
        teamName: team.name,
        recentMatches: matches,
        formString,
        goalsScored,
        goalsConceded,
        cleanSheets: matches.filter((m) => {
          const isHome = m.homeTeam.id === teamFDId;
          const opp = isHome ? m.score.fullTime.away : m.score.fullTime.home;
          return opp === 0;
        }).length,
      };
    }

    case "get_head_to_head": {
      const tlaA = input.team_a_tla!;
      const tlaB = input.team_b_tla!;
      const teamA = getTeamByTla(tlaA);
      const teamB = getTeamByTla(tlaB);
      if (!teamA) throw new Error(`Unknown team: ${tlaA}`);
      if (!teamB) throw new Error(`Unknown team: ${tlaB}`);

      return withCache(
        CacheKeys.h2h(teamA.footballDataId, teamB.footballDataId),
        TTL.H2H,
        () => getH2H(
          teamA.footballDataId, teamB.footballDataId,
          teamA.apiFootballId,  teamB.apiFootballId
        )
      );
    }

    case "get_team_stats": {
      const tla = input.team_tla!;
      const team = getTeamByTla(tla);
      if (!team) throw new Error(`Unknown team: ${tla}`);

      // Derive stats from recent form
      const matches = await withCache(
        CacheKeys.fixtures(team.footballDataId),
        TTL.FIXTURES,
        () => getTeamFixtures(team.footballDataId, 15, team.apiFootballId)
      );

      const statFDId = team.footballDataId;
      const goalsScored = matches.reduce((sum, m) => {
        const isHome = m.homeTeam.id === statFDId;
        return sum + (isHome ? (m.score.fullTime.home ?? 0) : (m.score.fullTime.away ?? 0));
      }, 0);

      const goalsConceded = matches.reduce((sum, m) => {
        const isHome = m.homeTeam.id === statFDId;
        return sum + (isHome ? (m.score.fullTime.away ?? 0) : (m.score.fullTime.home ?? 0));
      }, 0);

      const n = matches.length || 1;

      return {
        teamId: team.footballDataId,
        teamName: team.name,
        tla: team.tla,
        confederation: team.confederation,
        fifaRanking: team.fifaRanking,
        goalsPerGame: Math.round((goalsScored / n) * 100) / 100,
        goalsConcededPerGame: Math.round((goalsConceded / n) * 100) / 100,
        // Possession and shot data require api-football.com (freemium)
        // Placeholder values — replace with real data when API key is set
        possession: null,
        shotsPerGame: null,
        passAccuracy: null,
        note: "Detailed possession/shot stats require api-football.com key",
      };
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
