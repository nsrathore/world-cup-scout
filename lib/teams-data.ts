import { WorldCupTeam } from "@/types";

// World Cup 2026 — 48 qualified nations
// bsdTeamId: Bzzoiro Sports Data (BSD) team ID — sourced from GET /api/v2/worldcup/squads/ (team_id field)
export const WORLD_CUP_TEAMS: WorldCupTeam[] = [
  // CONMEBOL
  { tla: "BRA", name: "Brazil",                   group: "C", bsdTeamId: 463, flagEmoji: "🇧🇷", fifaRanking: 5,   confederation: "CONMEBOL" },
  { tla: "ARG", name: "Argentina",                group: "J", bsdTeamId: 489, flagEmoji: "🇦🇷", fifaRanking: 1,   confederation: "CONMEBOL" },
  { tla: "URU", name: "Uruguay",                  group: "H", bsdTeamId: 480, flagEmoji: "🇺🇾", fifaRanking: 14,  confederation: "CONMEBOL" },
  { tla: "COL", name: "Colombia",                 group: "K", bsdTeamId: 498, flagEmoji: "🇨🇴", fifaRanking: 9,   confederation: "CONMEBOL" },
  { tla: "ECU", name: "Ecuador",                  group: "E", bsdTeamId: 472, flagEmoji: "🇪🇨", fifaRanking: 32,  confederation: "CONMEBOL" },
  { tla: "PAR", name: "Paraguay",                 group: "?", bsdTeamId: 458, flagEmoji: "🇵🇾", fifaRanking: 54,  confederation: "CONMEBOL" },
  // UEFA
  { tla: "FRA", name: "France",                   group: "I", bsdTeamId: 485, flagEmoji: "🇫🇷", fifaRanking: 2,   confederation: "UEFA" },
  { tla: "ENG", name: "England",                  group: "L", bsdTeamId: 493, flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fifaRanking: 3,   confederation: "UEFA" },
  { tla: "ESP", name: "Spain",                    group: "H", bsdTeamId: 475, flagEmoji: "🇪🇸", fifaRanking: 6,   confederation: "UEFA" },
  { tla: "POR", name: "Portugal",                 group: "K", bsdTeamId: 491, flagEmoji: "🇵🇹", fifaRanking: 6,   confederation: "UEFA" },
  { tla: "GER", name: "Germany",                  group: "E", bsdTeamId: 467, flagEmoji: "🇩🇪", fifaRanking: 12,  confederation: "UEFA" },
  { tla: "NED", name: "Netherlands",              group: "F", bsdTeamId: 469, flagEmoji: "🇳🇱", fifaRanking: 7,   confederation: "UEFA" },
  { tla: "BEL", name: "Belgium",                  group: "G", bsdTeamId: 477, flagEmoji: "🇧🇪", fifaRanking: 3,   confederation: "UEFA" },
  { tla: "CRO", name: "Croatia",                  group: "L", bsdTeamId: 494, flagEmoji: "🇭🇷", fifaRanking: 9,   confederation: "UEFA" },
  { tla: "AUT", name: "Austria",                  group: "J",  bsdTeamId: 483, flagEmoji: "🇦🇹", fifaRanking: 25,  confederation: "UEFA" },
  { tla: "SUI", name: "Switzerland",              group: "B", bsdTeamId: 462, flagEmoji: "🇨🇭", fifaRanking: 19,  confederation: "UEFA" },
  { tla: "SCO", name: "Scotland",                 group: "C", bsdTeamId: 466, flagEmoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", fifaRanking: 39,  confederation: "UEFA" },
  { tla: "NOR", name: "Norway",                   group: "?", bsdTeamId: 488, flagEmoji: "🇳🇴", fifaRanking: 25,  confederation: "UEFA" },
  { tla: "SWE", name: "Sweden",                   group: "?", bsdTeamId: 731, flagEmoji: "🇸🇪", fifaRanking: 24,  confederation: "UEFA" },
  { tla: "CZE", name: "Czech Republic",           group: "?", bsdTeamId: 930, flagEmoji: "🇨🇿", fifaRanking: 38,  confederation: "UEFA" },
  { tla: "BIH", name: "Bosnia and Herzegovina",   group: "?", bsdTeamId: 931, flagEmoji: "🇧🇦", fifaRanking: 63,  confederation: "UEFA" },
  { tla: "TUR", name: "Turkey",                   group: "?", bsdTeamId: 932, flagEmoji: "🇹🇷", fifaRanking: 37,  confederation: "UEFA" },
  // CONCACAF
  { tla: "USA", name: "USA",                      group: "D", bsdTeamId: 457, flagEmoji: "🇺🇸", fifaRanking: 16,  confederation: "CONCACAF" },
  { tla: "MEX", name: "Mexico",                   group: "A", bsdTeamId: 451, flagEmoji: "🇲🇽", fifaRanking: 17,  confederation: "CONCACAF" },
  { tla: "CAN", name: "Canada",                   group: "B", bsdTeamId: 455, flagEmoji: "🇨🇦", fifaRanking: 49,  confederation: "CONCACAF" },
  { tla: "PAN", name: "Panama",                   group: "D", bsdTeamId: 496, flagEmoji: "🇵🇦", fifaRanking: 43,  confederation: "CONCACAF" },
  { tla: "HAI", name: "Haiti",                    group: "?", bsdTeamId: 465, flagEmoji: "🇭🇹", fifaRanking: 83,  confederation: "CONCACAF" },
  { tla: "CUW", name: "Curaçao",                  group: "?", bsdTeamId: 468, flagEmoji: "🇨🇼", fifaRanking: 107, confederation: "CONCACAF" },
  // CAF (Africa)
  { tla: "MAR", name: "Morocco",                  group: "C", bsdTeamId: 464, flagEmoji: "🇲🇦", fifaRanking: 14,  confederation: "CAF" },
  { tla: "SEN", name: "Senegal",                  group: "I", bsdTeamId: 486, flagEmoji: "🇸🇳", fifaRanking: 20,  confederation: "CAF" },
  { tla: "EGY", name: "Egypt",                    group: "G", bsdTeamId: 478, flagEmoji: "🇪🇬", fifaRanking: 34,  confederation: "CAF" },
  { tla: "GHA", name: "Ghana",                    group: "L", bsdTeamId: 495, flagEmoji: "🇬🇭", fifaRanking: 66,  confederation: "CAF" },
  { tla: "CIV", name: "Côte d'Ivoire",            group: "E", bsdTeamId: 471, flagEmoji: "🇨🇮", fifaRanking: 52,  confederation: "CAF" },
  { tla: "ALG", name: "Algeria",                  group: "J", bsdTeamId: 490, flagEmoji: "🇩🇿", fifaRanking: 35,  confederation: "CAF" },
  { tla: "TUN", name: "Tunisia",                  group: "?", bsdTeamId: 474, flagEmoji: "🇹🇳", fifaRanking: 36,  confederation: "CAF" },
  { tla: "CPV", name: "Cape Verde",               group: "?", bsdTeamId: 476, flagEmoji: "🇨🇻", fifaRanking: 71,  confederation: "CAF" },
  { tla: "RSA", name: "South Africa",             group: "?", bsdTeamId: 452, flagEmoji: "🇿🇦", fifaRanking: 67,  confederation: "CAF" },
  { tla: "COD", name: "DR Congo",                 group: "?", bsdTeamId: 648, flagEmoji: "🇨🇩", fifaRanking: 55,  confederation: "CAF" },
  // AFC (Asia)
  { tla: "JPN", name: "Japan",                    group: "F", bsdTeamId: 470, flagEmoji: "🇯🇵", fifaRanking: 15,  confederation: "AFC" },
  { tla: "KOR", name: "South Korea",              group: "A", bsdTeamId: 453, flagEmoji: "🇰🇷", fifaRanking: 23,  confederation: "AFC" },
  { tla: "IRN", name: "Iran",                     group: "G", bsdTeamId: 481, flagEmoji: "🇮🇷", fifaRanking: 22,  confederation: "AFC" },
  { tla: "AUS", name: "Australia",                group: "D", bsdTeamId: 459, flagEmoji: "🇦🇺", fifaRanking: 24,  confederation: "AFC" },
  { tla: "SAU", name: "Saudi Arabia",             group: "H", bsdTeamId: 479, flagEmoji: "🇸🇦", fifaRanking: 56,  confederation: "AFC" },
  { tla: "QAT", name: "Qatar",                    group: "B", bsdTeamId: 461, flagEmoji: "🇶🇦", fifaRanking: 37,  confederation: "AFC" },
  { tla: "IRQ", name: "Iraq",                     group: "I", bsdTeamId: 933, flagEmoji: "🇮🇶", fifaRanking: 58,  confederation: "AFC" },
  { tla: "UZB", name: "Uzbekistan",               group: "K", bsdTeamId: 497, flagEmoji: "🇺🇿", fifaRanking: 68,  confederation: "AFC" },
  { tla: "JOR", name: "Jordan",                   group: "?", bsdTeamId: 484, flagEmoji: "🇯🇴", fifaRanking: 70,  confederation: "AFC" },
  // OFC / Play-off
  { tla: "NZL", name: "New Zealand",              group: "G", bsdTeamId: 482, flagEmoji: "🇳🇿", fifaRanking: 90,  confederation: "OFC" },
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
