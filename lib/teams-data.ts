import { WorldCupTeam } from "@/types";

// World Cup 2026 — 48 qualified nations
// footballDataId: football-data.org team ID (kept for reference / cache-key compatibility)
// apiFootballId:  api-football.com team ID (kept for reference)
// bsdTeamId:      Bzzoiro Sports Data (BSD) team ID — sourced from GET /api/v2/worldcup/squads/ (team_id field)
export const WORLD_CUP_TEAMS: WorldCupTeam[] = [
  // CONMEBOL
  { tla: "BRA", name: "Brazil",                   group: "C", footballDataId: 764, apiFootballId: 6,    bsdTeamId: 463, flagEmoji: "🇧🇷", fifaRanking: 5,   confederation: "CONMEBOL" },
  { tla: "ARG", name: "Argentina",                group: "J", footballDataId: 762, apiFootballId: 26,   bsdTeamId: 489, flagEmoji: "🇦🇷", fifaRanking: 1,   confederation: "CONMEBOL" },
  { tla: "URU", name: "Uruguay",                  group: "H", footballDataId: 803, apiFootballId: 7,    bsdTeamId: 480, flagEmoji: "🇺🇾", fifaRanking: 14,  confederation: "CONMEBOL" },
  { tla: "COL", name: "Colombia",                 group: "K", footballDataId: 771, apiFootballId: 8,    bsdTeamId: 498, flagEmoji: "🇨🇴", fifaRanking: 9,   confederation: "CONMEBOL" },
  { tla: "ECU", name: "Ecuador",                  group: "E", footballDataId: 780, apiFootballId: 2382, bsdTeamId: 472, flagEmoji: "🇪🇨", fifaRanking: 32,  confederation: "CONMEBOL" },
  { tla: "PAR", name: "Paraguay",                 group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 458, flagEmoji: "🇵🇾", fifaRanking: 54,  confederation: "CONMEBOL" },
  // UEFA
  { tla: "FRA", name: "France",                   group: "I", footballDataId: 773, apiFootballId: 2,    bsdTeamId: 485, flagEmoji: "🇫🇷", fifaRanking: 2,   confederation: "UEFA" },
  { tla: "ENG", name: "England",                  group: "L", footballDataId: 770, apiFootballId: 10,   bsdTeamId: 493, flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fifaRanking: 3,   confederation: "UEFA" },
  { tla: "ESP", name: "Spain",                    group: "H", footballDataId: 760, apiFootballId: 9,    bsdTeamId: 475, flagEmoji: "🇪🇸", fifaRanking: 6,   confederation: "UEFA" },
  { tla: "POR", name: "Portugal",                 group: "K", footballDataId: 765, apiFootballId: 27,   bsdTeamId: 491, flagEmoji: "🇵🇹", fifaRanking: 6,   confederation: "UEFA" },
  { tla: "GER", name: "Germany",                  group: "E", footballDataId: 759, apiFootballId: 25,   bsdTeamId: 467, flagEmoji: "🇩🇪", fifaRanking: 12,  confederation: "UEFA" },
  { tla: "NED", name: "Netherlands",              group: "F", footballDataId: 779, apiFootballId: 1118, bsdTeamId: 469, flagEmoji: "🇳🇱", fifaRanking: 7,   confederation: "UEFA" },
  { tla: "BEL", name: "Belgium",                  group: "G", footballDataId: 763, apiFootballId: 1,    bsdTeamId: 477, flagEmoji: "🇧🇪", fifaRanking: 3,   confederation: "UEFA" },
  { tla: "CRO", name: "Croatia",                  group: "L", footballDataId: 799, apiFootballId: 3,    bsdTeamId: 494, flagEmoji: "🇭🇷", fifaRanking: 9,   confederation: "UEFA" },
  { tla: "AUT", name: "Austria",                  group: "J", footballDataId: 816, apiFootballId: 775,  bsdTeamId: 483, flagEmoji: "🇦🇹", fifaRanking: 25,  confederation: "UEFA" },
  { tla: "SUI", name: "Switzerland",              group: "B", footballDataId: 788, apiFootballId: 15,   bsdTeamId: 462, flagEmoji: "🇨🇭", fifaRanking: 19,  confederation: "UEFA" },
  { tla: "SCO", name: "Scotland",                 group: "C", footballDataId: 769, apiFootballId: 1108, bsdTeamId: 466, flagEmoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", fifaRanking: 39,  confederation: "UEFA" },
  { tla: "NOR", name: "Norway",                   group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 488, flagEmoji: "🇳🇴", fifaRanking: 25,  confederation: "UEFA" },
  { tla: "SWE", name: "Sweden",                   group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 731, flagEmoji: "🇸🇪", fifaRanking: 24,  confederation: "UEFA" },
  { tla: "CZE", name: "Czech Republic",           group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 930, flagEmoji: "🇨🇿", fifaRanking: 38,  confederation: "UEFA" },
  { tla: "BIH", name: "Bosnia and Herzegovina",   group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 931, flagEmoji: "🇧🇦", fifaRanking: 63,  confederation: "UEFA" },
  { tla: "TUR", name: "Turkey",                   group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 932, flagEmoji: "🇹🇷", fifaRanking: 37,  confederation: "UEFA" },
  // CONCACAF
  { tla: "USA", name: "USA",                      group: "D", footballDataId: 768, apiFootballId: 2384, bsdTeamId: 457, flagEmoji: "🇺🇸", fifaRanking: 16,  confederation: "CONCACAF" },
  { tla: "MEX", name: "Mexico",                   group: "A", footballDataId: 758, apiFootballId: 16,   bsdTeamId: 451, flagEmoji: "🇲🇽", fifaRanking: 17,  confederation: "CONCACAF" },
  { tla: "CAN", name: "Canada",                   group: "B", footballDataId: 772, apiFootballId: 5529, bsdTeamId: 455, flagEmoji: "🇨🇦", fifaRanking: 49,  confederation: "CONCACAF" },
  { tla: "PAN", name: "Panama",                   group: "D", footballDataId: 814, apiFootballId: 11,   bsdTeamId: 496, flagEmoji: "🇵🇦", fifaRanking: 43,  confederation: "CONCACAF" },
  { tla: "HAI", name: "Haiti",                    group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 465, flagEmoji: "🇭🇹", fifaRanking: 83,  confederation: "CONCACAF" },
  { tla: "CUW", name: "Curaçao",                  group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 468, flagEmoji: "🇨🇼", fifaRanking: 107, confederation: "CONCACAF" },
  // CAF (Africa)
  { tla: "MAR", name: "Morocco",                  group: "C", footballDataId: 804, apiFootballId: 31,   bsdTeamId: 464, flagEmoji: "🇲🇦", fifaRanking: 14,  confederation: "CAF" },
  { tla: "SEN", name: "Senegal",                  group: "I", footballDataId: 806, apiFootballId: 13,   bsdTeamId: 486, flagEmoji: "🇸🇳", fifaRanking: 20,  confederation: "CAF" },
  { tla: "EGY", name: "Egypt",                    group: "G", footballDataId: 801, apiFootballId: 32,   bsdTeamId: 478, flagEmoji: "🇪🇬", fifaRanking: 34,  confederation: "CAF" },
  { tla: "GHA", name: "Ghana",                    group: "L", footballDataId: 808, apiFootballId: 1504, bsdTeamId: 495, flagEmoji: "🇬🇭", fifaRanking: 66,  confederation: "CAF" },
  { tla: "CIV", name: "Côte d'Ivoire",            group: "E", footballDataId: 892, apiFootballId: 1501, bsdTeamId: 471, flagEmoji: "🇨🇮", fifaRanking: 52,  confederation: "CAF" },
  { tla: "ALG", name: "Algeria",                  group: "J", footballDataId: 800, apiFootballId: 1532, bsdTeamId: 490, flagEmoji: "🇩🇿", fifaRanking: 35,  confederation: "CAF" },
  { tla: "TUN", name: "Tunisia",                  group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 474, flagEmoji: "🇹🇳", fifaRanking: 36,  confederation: "CAF" },
  { tla: "CPV", name: "Cape Verde",               group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 476, flagEmoji: "🇨🇻", fifaRanking: 71,  confederation: "CAF" },
  { tla: "RSA", name: "South Africa",             group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 452, flagEmoji: "🇿🇦", fifaRanking: 67,  confederation: "CAF" },
  { tla: "COD", name: "DR Congo",                 group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 648, flagEmoji: "🇨🇩", fifaRanking: 55,  confederation: "CAF" },
  // AFC (Asia)
  { tla: "JPN", name: "Japan",                    group: "F", footballDataId: 792, apiFootballId: 12,   bsdTeamId: 470, flagEmoji: "🇯🇵", fifaRanking: 15,  confederation: "AFC" },
  { tla: "KOR", name: "South Korea",              group: "A", footballDataId: 796, apiFootballId: 17,   bsdTeamId: 453, flagEmoji: "🇰🇷", fifaRanking: 23,  confederation: "AFC" },
  { tla: "IRN", name: "Iran",                     group: "G", footballDataId: 793, apiFootballId: 22,   bsdTeamId: 481, flagEmoji: "🇮🇷", fifaRanking: 22,  confederation: "AFC" },
  { tla: "AUS", name: "Australia",                group: "D", footballDataId: 747, apiFootballId: 20,   bsdTeamId: 459, flagEmoji: "🇦🇺", fifaRanking: 24,  confederation: "AFC" },
  { tla: "SAU", name: "Saudi Arabia",             group: "H", footballDataId: 798, apiFootballId: 23,   bsdTeamId: 479, flagEmoji: "🇸🇦", fifaRanking: 56,  confederation: "AFC" },
  { tla: "QAT", name: "Qatar",                    group: "B", footballDataId: 833, apiFootballId: 1569, bsdTeamId: 461, flagEmoji: "🇶🇦", fifaRanking: 37,  confederation: "AFC" },
  { tla: "IRQ", name: "Iraq",                     group: "I", footballDataId: 828, apiFootballId: 1567, bsdTeamId: 933, flagEmoji: "🇮🇶", fifaRanking: 58,  confederation: "AFC" },
  { tla: "UZB", name: "Uzbekistan",               group: "K", footballDataId: 831, apiFootballId: 1568, bsdTeamId: 497, flagEmoji: "🇺🇿", fifaRanking: 68,  confederation: "AFC" },
  { tla: "JOR", name: "Jordan",                   group: "?", footballDataId: 0,   apiFootballId: 0,    bsdTeamId: 484, flagEmoji: "🇯🇴", fifaRanking: 70,  confederation: "AFC" },
  // OFC / Play-off
  { tla: "NZL", name: "New Zealand",              group: "G", footballDataId: 751, apiFootballId: 4673, bsdTeamId: 482, flagEmoji: "🇳🇿", fifaRanking: 90,  confederation: "OFC" },
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
