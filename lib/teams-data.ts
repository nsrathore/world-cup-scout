import { WorldCupTeam } from "@/types";

// World Cup 2026 — 48 qualified nations
// football-data.org IDs used for squad/fixture lookups
export const WORLD_CUP_TEAMS: WorldCupTeam[] = [
  // CONMEBOL
  { tla: "BRA", name: "Brazil",    group: "D", footballDataId: 764,  flagEmoji: "🇧🇷", fifaRanking: 5,  confederation: "CONMEBOL" },
  { tla: "ARG", name: "Argentina", group: "A", footballDataId: 762,  flagEmoji: "🇦🇷", fifaRanking: 1,  confederation: "CONMEBOL" },
  { tla: "URU", name: "Uruguay",   group: "C", footballDataId: 788,  flagEmoji: "🇺🇾", fifaRanking: 14, confederation: "CONMEBOL" },
  { tla: "COL", name: "Colombia",  group: "F", footballDataId: 771,  flagEmoji: "🇨🇴", fifaRanking: 9,  confederation: "CONMEBOL" },
  { tla: "ECU", name: "Ecuador",   group: "B", footballDataId: 780,  flagEmoji: "🇪🇨", fifaRanking: 32, confederation: "CONMEBOL" },
  { tla: "VEN", name: "Venezuela", group: "H", footballDataId: 791,  flagEmoji: "🇻🇪", fifaRanking: 30, confederation: "CONMEBOL" },
  // UEFA
  { tla: "FRA", name: "France",    group: "A", footballDataId: 773,  flagEmoji: "🇫🇷", fifaRanking: 2,  confederation: "UEFA" },
  { tla: "ENG", name: "England",   group: "B", footballDataId: 770,  flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fifaRanking: 3,  confederation: "UEFA" },
  { tla: "ESP", name: "Spain",     group: "C", footballDataId: 760,  flagEmoji: "🇪🇸", fifaRanking: 6,  confederation: "UEFA" },
  { tla: "POR", name: "Portugal",  group: "E", footballDataId: 765,  flagEmoji: "🇵🇹", fifaRanking: 6,  confederation: "UEFA" },
  { tla: "GER", name: "Germany",   group: "F", footballDataId: 759,  flagEmoji: "🇩🇪", fifaRanking: 12, confederation: "UEFA" },
  { tla: "NED", name: "Netherlands", group: "G", footballDataId: 779, flagEmoji: "🇳🇱", fifaRanking: 7, confederation: "UEFA" },
  { tla: "BEL", name: "Belgium",   group: "H", footballDataId: 763,  flagEmoji: "🇧🇪", fifaRanking: 3,  confederation: "UEFA" },
  { tla: "ITA", name: "Italy",     group: "A", footballDataId: 784,  flagEmoji: "🇮🇹", fifaRanking: 11, confederation: "UEFA" },
  { tla: "CRO", name: "Croatia",   group: "B", footballDataId: 799,  flagEmoji: "🇭🇷", fifaRanking: 9,  confederation: "UEFA" },
  { tla: "DEN", name: "Denmark",   group: "C", footballDataId: 782,  flagEmoji: "🇩🇰", fifaRanking: 13, confederation: "UEFA" },
  { tla: "AUT", name: "Austria",   group: "D", footballDataId: 816,  flagEmoji: "🇦🇹", fifaRanking: 25, confederation: "UEFA" },
  { tla: "SUI", name: "Switzerland", group: "E", footballDataId: 788, flagEmoji: "🇨🇭", fifaRanking: 19, confederation: "UEFA" },
  { tla: "SCO", name: "Scotland",  group: "G", footballDataId: 769,  flagEmoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", fifaRanking: 39, confederation: "UEFA" },
  { tla: "SRB", name: "Serbia",    group: "H", footballDataId: 781,  flagEmoji: "🇷🇸", fifaRanking: 33, confederation: "UEFA" },
  { tla: "POL", name: "Poland",    group: "F", footballDataId: 794,  flagEmoji: "🇵🇱", fifaRanking: 26, confederation: "UEFA" },
  { tla: "UKR", name: "Ukraine",   group: "A", footballDataId: 790,  flagEmoji: "🇺🇦", fifaRanking: 24, confederation: "UEFA" },
  { tla: "HUN", name: "Hungary",   group: "B", footballDataId: 827,  flagEmoji: "🇭🇺", fifaRanking: 28, confederation: "UEFA" },
  { tla: "SVK", name: "Slovakia",  group: "C", footballDataId: 820,  flagEmoji: "🇸🇰", fifaRanking: 46, confederation: "UEFA" },
  // CONCACAF
  { tla: "USA", name: "USA",       group: "C", footballDataId: 768,  flagEmoji: "🇺🇸", fifaRanking: 16, confederation: "CONCACAF" },
  { tla: "MEX", name: "Mexico",    group: "A", footballDataId: 758,  flagEmoji: "🇲🇽", fifaRanking: 17, confederation: "CONCACAF" },
  { tla: "CAN", name: "Canada",    group: "B", footballDataId: 772,  flagEmoji: "🇨🇦", fifaRanking: 49, confederation: "CONCACAF" },
  { tla: "PAN", name: "Panama",    group: "D", footballDataId: 780,  flagEmoji: "🇵🇦", fifaRanking: 43, confederation: "CONCACAF" },
  { tla: "JAM", name: "Jamaica",   group: "E", footballDataId: 785,  flagEmoji: "🇯🇲", fifaRanking: 57, confederation: "CONCACAF" },
  { tla: "HON", name: "Honduras",  group: "G", footballDataId: 783,  flagEmoji: "🇭🇳", fifaRanking: 78, confederation: "CONCACAF" },
  // CAF (Africa)
  { tla: "MAR", name: "Morocco",   group: "F", footballDataId: 804,  flagEmoji: "🇲🇦", fifaRanking: 14, confederation: "CAF" },
  { tla: "SEN", name: "Senegal",   group: "H", footballDataId: 806,  flagEmoji: "🇸🇳", fifaRanking: 20, confederation: "CAF" },
  { tla: "EGY", name: "Egypt",     group: "A", footballDataId: 803,  flagEmoji: "🇪🇬", fifaRanking: 34, confederation: "CAF" },
  { tla: "NGA", name: "Nigeria",   group: "B", footballDataId: 805,  flagEmoji: "🇳🇬", fifaRanking: 28, confederation: "CAF" },
  { tla: "CMR", name: "Cameroon",  group: "C", footballDataId: 802,  flagEmoji: "🇨🇲", fifaRanking: 43, confederation: "CAF" },
  { tla: "GHA", name: "Ghana",     group: "D", footballDataId: 808,  flagEmoji: "🇬🇭", fifaRanking: 66, confederation: "CAF" },
  { tla: "CIV", name: "Côte d'Ivoire", group: "E", footballDataId: 801, flagEmoji: "🇨🇮", fifaRanking: 52, confederation: "CAF" },
  { tla: "ALG", name: "Algeria",   group: "G", footballDataId: 800,  flagEmoji: "🇩🇿", fifaRanking: 35, confederation: "CAF" },
  // AFC (Asia)
  { tla: "JPN", name: "Japan",     group: "E", footballDataId: 792,  flagEmoji: "🇯🇵", fifaRanking: 15, confederation: "AFC" },
  { tla: "KOR", name: "South Korea", group: "F", footballDataId: 796, flagEmoji: "🇰🇷", fifaRanking: 23, confederation: "AFC" },
  { tla: "IRN", name: "Iran",      group: "G", footballDataId: 793,  flagEmoji: "🇮🇷", fifaRanking: 22, confederation: "AFC" },
  { tla: "AUS", name: "Australia", group: "H", footballDataId: 747,  flagEmoji: "🇦🇺", fifaRanking: 24, confederation: "AFC" },
  { tla: "SAU", name: "Saudi Arabia", group: "A", footballDataId: 798, flagEmoji: "🇸🇦", fifaRanking: 56, confederation: "AFC" },
  { tla: "QAT", name: "Qatar",     group: "B", footballDataId: 833,  flagEmoji: "🇶🇦", fifaRanking: 37, confederation: "AFC" },
  { tla: "IRQ", name: "Iraq",      group: "C", footballDataId: 794,  flagEmoji: "🇮🇶", fifaRanking: 58, confederation: "AFC" },
  { tla: "UZB", name: "Uzbekistan", group: "D", footballDataId: 831, flagEmoji: "🇺🇿", fifaRanking: 68, confederation: "AFC" },
  // OFC / Play-off
  { tla: "NZL", name: "New Zealand", group: "H", footballDataId: 751, flagEmoji: "🇳🇿", fifaRanking: 90, confederation: "OFC" },
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
