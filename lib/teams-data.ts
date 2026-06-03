import { WorldCupTeam } from "@/types";

// World Cup 2026 — 48 qualified nations
// footballDataId: football-data.org team ID (used for squad lookups)
// apiFootballId:  api-football.com team ID (used for fixtures + H2H — far more data on free tier)
export const WORLD_CUP_TEAMS: WorldCupTeam[] = [
  // CONMEBOL
  { tla: "BRA", name: "Brazil",    group: "D", footballDataId: 764,  apiFootballId: 6,    flagEmoji: "🇧🇷", fifaRanking: 5,  confederation: "CONMEBOL" },
  { tla: "ARG", name: "Argentina", group: "A", footballDataId: 762,  apiFootballId: 26,   flagEmoji: "🇦🇷", fifaRanking: 1,  confederation: "CONMEBOL" },
  { tla: "URU", name: "Uruguay",   group: "C", footballDataId: 803,  apiFootballId: 7,    flagEmoji: "🇺🇾", fifaRanking: 14, confederation: "CONMEBOL" },
  { tla: "COL", name: "Colombia",  group: "F", footballDataId: 771,  apiFootballId: 8,    flagEmoji: "🇨🇴", fifaRanking: 9,  confederation: "CONMEBOL" },
  { tla: "ECU", name: "Ecuador",   group: "B", footballDataId: 780,  apiFootballId: 2382, flagEmoji: "🇪🇨", fifaRanking: 32, confederation: "CONMEBOL" },
  { tla: "VEN", name: "Venezuela", group: "H", footballDataId: 791,  apiFootballId: 2379, flagEmoji: "🇻🇪", fifaRanking: 30, confederation: "CONMEBOL" },
  // UEFA
  { tla: "FRA", name: "France",    group: "A", footballDataId: 773,  apiFootballId: 2,    flagEmoji: "🇫🇷", fifaRanking: 2,  confederation: "UEFA" },
  { tla: "ENG", name: "England",   group: "B", footballDataId: 770,  apiFootballId: 10,   flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fifaRanking: 3,  confederation: "UEFA" },
  { tla: "ESP", name: "Spain",     group: "C", footballDataId: 760,  apiFootballId: 9,    flagEmoji: "🇪🇸", fifaRanking: 6,  confederation: "UEFA" },
  { tla: "POR", name: "Portugal",  group: "E", footballDataId: 765,  apiFootballId: 27,   flagEmoji: "🇵🇹", fifaRanking: 6,  confederation: "UEFA" },
  { tla: "GER", name: "Germany",   group: "F", footballDataId: 759,  apiFootballId: 25,   flagEmoji: "🇩🇪", fifaRanking: 12, confederation: "UEFA" },
  { tla: "NED", name: "Netherlands", group: "G", footballDataId: 779, apiFootballId: 1118, flagEmoji: "🇳🇱", fifaRanking: 7, confederation: "UEFA" },
  { tla: "BEL", name: "Belgium",   group: "H", footballDataId: 763,  apiFootballId: 1,    flagEmoji: "🇧🇪", fifaRanking: 3,  confederation: "UEFA" },
  { tla: "ITA", name: "Italy",     group: "A", footballDataId: 784,  apiFootballId: 768,  flagEmoji: "🇮🇹", fifaRanking: 11, confederation: "UEFA" },
  { tla: "CRO", name: "Croatia",   group: "B", footballDataId: 799,  apiFootballId: 3,    flagEmoji: "🇭🇷", fifaRanking: 9,  confederation: "UEFA" },
  { tla: "DEN", name: "Denmark",   group: "C", footballDataId: 782,  apiFootballId: 21,   flagEmoji: "🇩🇰", fifaRanking: 13, confederation: "UEFA" },
  { tla: "AUT", name: "Austria",   group: "D", footballDataId: 816,  apiFootballId: 775,  flagEmoji: "🇦🇹", fifaRanking: 25, confederation: "UEFA" },
  { tla: "SUI", name: "Switzerland", group: "E", footballDataId: 788, apiFootballId: 15,  flagEmoji: "🇨🇭", fifaRanking: 19, confederation: "UEFA" },
  { tla: "SCO", name: "Scotland",  group: "G", footballDataId: 769,  apiFootballId: 1108, flagEmoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", fifaRanking: 39, confederation: "UEFA" },
  { tla: "SRB", name: "Serbia",    group: "H", footballDataId: 781,  apiFootballId: 14,   flagEmoji: "🇷🇸", fifaRanking: 33, confederation: "UEFA" },
  { tla: "POL", name: "Poland",    group: "F", footballDataId: 794,  apiFootballId: 24,   flagEmoji: "🇵🇱", fifaRanking: 26, confederation: "UEFA" },
  { tla: "UKR", name: "Ukraine",   group: "A", footballDataId: 790,  apiFootballId: 772,  flagEmoji: "🇺🇦", fifaRanking: 24, confederation: "UEFA" },
  { tla: "HUN", name: "Hungary",   group: "B", footballDataId: 827,  apiFootballId: 769,  flagEmoji: "🇭🇺", fifaRanking: 28, confederation: "UEFA" },
  { tla: "SVK", name: "Slovakia",  group: "C", footballDataId: 820,  apiFootballId: 773,  flagEmoji: "🇸🇰", fifaRanking: 46, confederation: "UEFA" },
  // CONCACAF
  { tla: "USA", name: "USA",       group: "C", footballDataId: 768,  apiFootballId: 2384, flagEmoji: "🇺🇸", fifaRanking: 16, confederation: "CONCACAF" },
  { tla: "MEX", name: "Mexico",    group: "A", footballDataId: 758,  apiFootballId: 16,   flagEmoji: "🇲🇽", fifaRanking: 17, confederation: "CONCACAF" },
  { tla: "CAN", name: "Canada",    group: "B", footballDataId: 772,  apiFootballId: 5529, flagEmoji: "🇨🇦", fifaRanking: 49, confederation: "CONCACAF" },
  { tla: "PAN", name: "Panama",    group: "D", footballDataId: 814,  apiFootballId: 11,   flagEmoji: "🇵🇦", fifaRanking: 43, confederation: "CONCACAF" },
  { tla: "JAM", name: "Jamaica",   group: "E", footballDataId: 785,  apiFootballId: 2385, flagEmoji: "🇯🇲", fifaRanking: 57, confederation: "CONCACAF" },
  { tla: "HON", name: "Honduras",  group: "G", footballDataId: 783,  apiFootballId: 4672, flagEmoji: "🇭🇳", fifaRanking: 78, confederation: "CONCACAF" },
  // CAF (Africa)
  { tla: "MAR", name: "Morocco",   group: "F", footballDataId: 804,  apiFootballId: 31,   flagEmoji: "🇲🇦", fifaRanking: 14, confederation: "CAF" },
  { tla: "SEN", name: "Senegal",   group: "H", footballDataId: 806,  apiFootballId: 13,   flagEmoji: "🇸🇳", fifaRanking: 20, confederation: "CAF" },
  { tla: "EGY", name: "Egypt",     group: "A", footballDataId: 801,  apiFootballId: 32,   flagEmoji: "🇪🇬", fifaRanking: 34, confederation: "CAF" },
  { tla: "NGA", name: "Nigeria",   group: "B", footballDataId: 805,  apiFootballId: 19,   flagEmoji: "🇳🇬", fifaRanking: 28, confederation: "CAF" },
  { tla: "CMR", name: "Cameroon",  group: "C", footballDataId: 802,  apiFootballId: 1530, flagEmoji: "🇨🇲", fifaRanking: 43, confederation: "CAF" },
  { tla: "GHA", name: "Ghana",     group: "D", footballDataId: 808,  apiFootballId: 1504, flagEmoji: "🇬🇭", fifaRanking: 66, confederation: "CAF" },
  { tla: "CIV", name: "Côte d'Ivoire", group: "E", footballDataId: 892, apiFootballId: 1501, flagEmoji: "🇨🇮", fifaRanking: 52, confederation: "CAF" },
  { tla: "ALG", name: "Algeria",   group: "G", footballDataId: 800,  apiFootballId: 1532, flagEmoji: "🇩🇿", fifaRanking: 35, confederation: "CAF" },
  // AFC (Asia)
  { tla: "JPN", name: "Japan",     group: "E", footballDataId: 792,  apiFootballId: 12,   flagEmoji: "🇯🇵", fifaRanking: 15, confederation: "AFC" },
  { tla: "KOR", name: "South Korea", group: "F", footballDataId: 796, apiFootballId: 17,  flagEmoji: "🇰🇷", fifaRanking: 23, confederation: "AFC" },
  { tla: "IRN", name: "Iran",      group: "G", footballDataId: 793,  apiFootballId: 22,   flagEmoji: "🇮🇷", fifaRanking: 22, confederation: "AFC" },
  { tla: "AUS", name: "Australia", group: "H", footballDataId: 747,  apiFootballId: 20,   flagEmoji: "🇦🇺", fifaRanking: 24, confederation: "AFC" },
  { tla: "SAU", name: "Saudi Arabia", group: "A", footballDataId: 798, apiFootballId: 23, flagEmoji: "🇸🇦", fifaRanking: 56, confederation: "AFC" },
  { tla: "QAT", name: "Qatar",     group: "B", footballDataId: 833,  apiFootballId: 1569, flagEmoji: "🇶🇦", fifaRanking: 37, confederation: "AFC" },
  { tla: "IRQ", name: "Iraq",      group: "C", footballDataId: 828,  apiFootballId: 1567, flagEmoji: "🇮🇶", fifaRanking: 58, confederation: "AFC" },
  { tla: "UZB", name: "Uzbekistan", group: "D", footballDataId: 831, apiFootballId: 1568, flagEmoji: "🇺🇿", fifaRanking: 68, confederation: "AFC" },
  // OFC / Play-off
  { tla: "NZL", name: "New Zealand", group: "H", footballDataId: 751, apiFootballId: 4673, flagEmoji: "🇳🇿", fifaRanking: 90, confederation: "OFC" },
];

export const getTeamByTla = (tla: string): WorldCupTeam | undefined =>
  WORLD_CUP_TEAMS.find((t) => t.tla.toLowerCase() === tla.toLowerCase());

export const getTeamsByConfederation = (conf: WorldCupTeam["confederation"]) =>
  WORLD_CUP_TEAMS.filter((t) => t.confederation === conf);

export const searchTeams = (query: string): WorldCupTeam[] => {
  const q = query.toLowerCase();
  return WORLD_CUP_TEAMS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.tla.toLowerCase().includes(q)
  );
};
