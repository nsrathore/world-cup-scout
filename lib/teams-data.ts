import { WorldCupTeam } from "@/types";

// World Cup 2026 — 48 qualified nations
// footballDataId: football-data.org team ID (kept for reference / cache-key compatibility)
// apiFootballId:  api-football.com team ID (kept for reference)
// bsdTeamId:      Bzzoiro Sports Data (BSD) team ID — primary data source
export const WORLD_CUP_TEAMS: WorldCupTeam[] = [
  // CONMEBOL
  { tla: "BRA", name: "Brazil",        group: "C", footballDataId: 764, apiFootballId: 6,    bsdTeamId: 77,  flagEmoji: "🇧🇷", fifaRanking: 5,  confederation: "CONMEBOL" },
  { tla: "ARG", name: "Argentina",     group: "J", footballDataId: 762, apiFootballId: 26,   bsdTeamId: 1,   flagEmoji: "🇦🇷", fifaRanking: 1,  confederation: "CONMEBOL" },
  { tla: "URU", name: "Uruguay",       group: "H", footballDataId: 803, apiFootballId: 7,    bsdTeamId: 34,  flagEmoji: "🇺🇾", fifaRanking: 14, confederation: "CONMEBOL" },
  { tla: "COL", name: "Colombia",      group: "K", footballDataId: 771, apiFootballId: 8,    bsdTeamId: 67,  flagEmoji: "🇨🇴", fifaRanking: 9,  confederation: "CONMEBOL" },
  { tla: "ECU", name: "Ecuador",       group: "E", footballDataId: 780, apiFootballId: 2382, bsdTeamId: 267, flagEmoji: "🇪🇨", fifaRanking: 32, confederation: "CONMEBOL" },
  { tla: "VEN", name: "Venezuela",     group: "E", footballDataId: 791, apiFootballId: 2379, bsdTeamId: 318, flagEmoji: "🇻🇪", fifaRanking: 30, confederation: "CONMEBOL" },
  // UEFA
  { tla: "FRA", name: "France",        group: "I", footballDataId: 773, apiFootballId: 2,    bsdTeamId: 9,   flagEmoji: "🇫🇷", fifaRanking: 2,  confederation: "UEFA" },
  { tla: "ENG", name: "England",       group: "L", footballDataId: 770, apiFootballId: 10,   bsdTeamId: 7,   flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fifaRanking: 3,  confederation: "UEFA" },
  { tla: "ESP", name: "Spain",         group: "H", footballDataId: 760, apiFootballId: 9,    bsdTeamId: 8,   flagEmoji: "🇪🇸", fifaRanking: 6,  confederation: "UEFA" },
  { tla: "POR", name: "Portugal",      group: "K", footballDataId: 765, apiFootballId: 27,   bsdTeamId: 56,  flagEmoji: "🇵🇹", fifaRanking: 6,  confederation: "UEFA" },
  { tla: "GER", name: "Germany",       group: "E", footballDataId: 759, apiFootballId: 25,   bsdTeamId: 14,  flagEmoji: "🇩🇪", fifaRanking: 12, confederation: "UEFA" },
  { tla: "NED", name: "Netherlands",   group: "F", footballDataId: 779, apiFootballId: 1118, bsdTeamId: 27,  flagEmoji: "🇳🇱", fifaRanking: 7,  confederation: "UEFA" },
  { tla: "BEL", name: "Belgium",       group: "G", footballDataId: 763, apiFootballId: 1,    bsdTeamId: 5,   flagEmoji: "🇧🇪", fifaRanking: 3,  confederation: "UEFA" },
  { tla: "ITA", name: "Italy",         group: "A", footballDataId: 784, apiFootballId: 768,  bsdTeamId: 15,  flagEmoji: "🇮🇹", fifaRanking: 11, confederation: "UEFA" },
  { tla: "CRO", name: "Croatia",       group: "L", footballDataId: 799, apiFootballId: 3,    bsdTeamId: 69,  flagEmoji: "🇭🇷", fifaRanking: 9,  confederation: "UEFA" },
  { tla: "DEN", name: "Denmark",       group: "A", footballDataId: 782, apiFootballId: 21,   bsdTeamId: 22,  flagEmoji: "🇩🇰", fifaRanking: 13, confederation: "UEFA" },
  { tla: "AUT", name: "Austria",       group: "J", footballDataId: 816, apiFootballId: 775,  bsdTeamId: 58,  flagEmoji: "🇦🇹", fifaRanking: 25, confederation: "UEFA" },
  { tla: "SUI", name: "Switzerland",   group: "B", footballDataId: 788, apiFootballId: 15,   bsdTeamId: 32,  flagEmoji: "🇨🇭", fifaRanking: 19, confederation: "UEFA" },
  { tla: "SCO", name: "Scotland",      group: "C", footballDataId: 769, apiFootballId: 1108, bsdTeamId: 41,  flagEmoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", fifaRanking: 39, confederation: "UEFA" },
  { tla: "SRB", name: "Serbia",        group: "A", footballDataId: 781, apiFootballId: 14,   bsdTeamId: 63,  flagEmoji: "🇷🇸", fifaRanking: 33, confederation: "UEFA" },
  { tla: "POL", name: "Poland",        group: "A", footballDataId: 794, apiFootballId: 24,   bsdTeamId: 50,  flagEmoji: "🇵🇱", fifaRanking: 26, confederation: "UEFA" },
  { tla: "UKR", name: "Ukraine",       group: "B", footballDataId: 790, apiFootballId: 772,  bsdTeamId: 76,  flagEmoji: "🇺🇦", fifaRanking: 24, confederation: "UEFA" },
  { tla: "HUN", name: "Hungary",       group: "A", footballDataId: 827, apiFootballId: 769,  bsdTeamId: 57,  flagEmoji: "🇭🇺", fifaRanking: 28, confederation: "UEFA" },
  { tla: "SVK", name: "Slovakia",      group: "A", footballDataId: 820, apiFootballId: 773,  bsdTeamId: 72,  flagEmoji: "🇸🇰", fifaRanking: 46, confederation: "UEFA" },
  // CONCACAF
  { tla: "USA", name: "USA",           group: "D", footballDataId: 768, apiFootballId: 2384, bsdTeamId: 24,  flagEmoji: "🇺🇸", fifaRanking: 16, confederation: "CONCACAF" },
  { tla: "MEX", name: "Mexico",        group: "A", footballDataId: 758, apiFootballId: 16,   bsdTeamId: 26,  flagEmoji: "🇲🇽", fifaRanking: 17, confederation: "CONCACAF" },
  { tla: "CAN", name: "Canada",        group: "B", footballDataId: 772, apiFootballId: 5529, bsdTeamId: 96,  flagEmoji: "🇨🇦", fifaRanking: 49, confederation: "CONCACAF" },
  { tla: "PAN", name: "Panama",        group: "D", footballDataId: 814, apiFootballId: 11,   bsdTeamId: 166, flagEmoji: "🇵🇦", fifaRanking: 43, confederation: "CONCACAF" },
  { tla: "JAM", name: "Jamaica",       group: "E", footballDataId: 785, apiFootballId: 2385, bsdTeamId: 181, flagEmoji: "🇯🇲", fifaRanking: 57, confederation: "CONCACAF" },
  { tla: "HON", name: "Honduras",      group: "A", footballDataId: 783, apiFootballId: 4672, bsdTeamId: 188, flagEmoji: "🇭🇳", fifaRanking: 78, confederation: "CONCACAF" },
  // CAF (Africa)
  { tla: "MAR", name: "Morocco",       group: "C", footballDataId: 804, apiFootballId: 31,   bsdTeamId: 120, flagEmoji: "🇲🇦", fifaRanking: 14, confederation: "CAF" },
  { tla: "SEN", name: "Senegal",       group: "I", footballDataId: 806, apiFootballId: 13,   bsdTeamId: 133, flagEmoji: "🇸🇳", fifaRanking: 20, confederation: "CAF" },
  { tla: "EGY", name: "Egypt",         group: "G", footballDataId: 801, apiFootballId: 32,   bsdTeamId: 112, flagEmoji: "🇪🇬", fifaRanking: 34, confederation: "CAF" },
  { tla: "NGA", name: "Nigeria",       group: "C", footballDataId: 805, apiFootballId: 19,   bsdTeamId: 38,  flagEmoji: "🇳🇬", fifaRanking: 28, confederation: "CAF" },
  { tla: "CMR", name: "Cameroon",      group: "F", footballDataId: 802, apiFootballId: 1530, bsdTeamId: 35,  flagEmoji: "🇨🇲", fifaRanking: 43, confederation: "CAF" },
  { tla: "GHA", name: "Ghana",         group: "L", footballDataId: 808, apiFootballId: 1504, bsdTeamId: 117, flagEmoji: "🇬🇭", fifaRanking: 66, confederation: "CAF" },
  { tla: "CIV", name: "Côte d'Ivoire", group: "E", footballDataId: 892, apiFootballId: 1501, bsdTeamId: 116, flagEmoji: "🇨🇮", fifaRanking: 52, confederation: "CAF" },
  { tla: "ALG", name: "Algeria",       group: "J", footballDataId: 800, apiFootballId: 1532, bsdTeamId: 100, flagEmoji: "🇩🇿", fifaRanking: 35, confederation: "CAF" },
  // AFC (Asia)
  { tla: "JPN", name: "Japan",         group: "F", footballDataId: 792, apiFootballId: 12,   bsdTeamId: 21,  flagEmoji: "🇯🇵", fifaRanking: 15, confederation: "AFC" },
  { tla: "KOR", name: "South Korea",   group: "A", footballDataId: 796, apiFootballId: 17,   bsdTeamId: 46,  flagEmoji: "🇰🇷", fifaRanking: 23, confederation: "AFC" },
  { tla: "IRN", name: "Iran",          group: "G", footballDataId: 793, apiFootballId: 22,   bsdTeamId: 45,  flagEmoji: "🇮🇷", fifaRanking: 22, confederation: "AFC" },
  { tla: "AUS", name: "Australia",     group: "D", footballDataId: 747, apiFootballId: 20,   bsdTeamId: 26,  flagEmoji: "🇦🇺", fifaRanking: 24, confederation: "AFC" },
  { tla: "SAU", name: "Saudi Arabia",  group: "H", footballDataId: 798, apiFootballId: 23,   bsdTeamId: 144, flagEmoji: "🇸🇦", fifaRanking: 56, confederation: "AFC" },
  { tla: "QAT", name: "Qatar",         group: "B", footballDataId: 833, apiFootballId: 1569, bsdTeamId: 141, flagEmoji: "🇶🇦", fifaRanking: 37, confederation: "AFC" },
  { tla: "IRQ", name: "Iraq",          group: "I", footballDataId: 828, apiFootballId: 1567, bsdTeamId: 143, flagEmoji: "🇮🇶", fifaRanking: 58, confederation: "AFC" },
  { tla: "UZB", name: "Uzbekistan",    group: "K", footballDataId: 831, apiFootballId: 1568, bsdTeamId: 179, flagEmoji: "🇺🇿", fifaRanking: 68, confederation: "AFC" },
  // OFC / Play-off
  { tla: "NZL", name: "New Zealand",   group: "G", footballDataId: 751, apiFootballId: 4673, bsdTeamId: 95,  flagEmoji: "🇳🇿", fifaRanking: 90, confederation: "OFC" },
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
