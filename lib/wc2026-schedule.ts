/**
 * FIFA World Cup 2026 — Group Stage Schedule
 * Hardcoded to avoid wasting API quota on static data.
 * Dates are in UTC. Venues use FIFA official names.
 */

export interface WCFixture {
  matchday: number;
  group: string;
  date: string;
  homeTeamTla: string;
  awayTeamTla: string;
  venue: string;
  city: string;
}

export const WC2026_GROUP_FIXTURES: WCFixture[] = [
  // ── GROUP A: Mexico, South Africa, South Korea, Czechia ──
  { matchday: 1, group: "A", date: "2026-06-11T19:00:00Z", homeTeamTla: "MEX", awayTeamTla: "RSA", venue: "Estadio Azteca",            city: "Mexico City" },
  { matchday: 1, group: "A", date: "2026-06-12T02:00:00Z", homeTeamTla: "KOR", awayTeamTla: "CZE", venue: "SoFi Stadium",             city: "Los Angeles" },
  { matchday: 2, group: "A", date: "2026-06-16T22:00:00Z", homeTeamTla: "MEX", awayTeamTla: "KOR", venue: "Estadio Guadalajara",       city: "Guadalajara" },
  { matchday: 2, group: "A", date: "2026-06-17T02:00:00Z", homeTeamTla: "RSA", awayTeamTla: "CZE", venue: "AT&T Stadium",             city: "Dallas" },
  { matchday: 3, group: "A", date: "2026-06-21T02:00:00Z", homeTeamTla: "MEX", awayTeamTla: "CZE", venue: "Estadio Azteca",            city: "Mexico City" },
  { matchday: 3, group: "A", date: "2026-06-21T02:00:00Z", homeTeamTla: "KOR", awayTeamTla: "RSA", venue: "NRG Stadium",              city: "Houston" },

  // ── GROUP B: Canada, Bosnia & Herzegovina, Qatar, Switzerland ──
  { matchday: 1, group: "B", date: "2026-06-12T23:00:00Z", homeTeamTla: "CAN", awayTeamTla: "BIH", venue: "BMO Field",                city: "Toronto" },
  { matchday: 1, group: "B", date: "2026-06-13T02:00:00Z", homeTeamTla: "QAT", awayTeamTla: "SUI", venue: "Levi's Stadium",           city: "San Francisco" },
  { matchday: 2, group: "B", date: "2026-06-17T22:00:00Z", homeTeamTla: "CAN", awayTeamTla: "QAT", venue: "BC Place",                 city: "Vancouver" },
  { matchday: 2, group: "B", date: "2026-06-18T02:00:00Z", homeTeamTla: "BIH", awayTeamTla: "SUI", venue: "MetLife Stadium",          city: "New York/NJ" },
  { matchday: 3, group: "B", date: "2026-06-22T02:00:00Z", homeTeamTla: "CAN", awayTeamTla: "SUI", venue: "BC Place",                 city: "Vancouver" },
  { matchday: 3, group: "B", date: "2026-06-22T02:00:00Z", homeTeamTla: "BIH", awayTeamTla: "QAT", venue: "Gillette Stadium",         city: "Boston" },

  // ── GROUP C: Brazil, Morocco, Haiti, Scotland ──
  { matchday: 1, group: "C", date: "2026-06-13T22:00:00Z", homeTeamTla: "BRA", awayTeamTla: "MAR", venue: "MetLife Stadium",          city: "New York/NJ" },
  { matchday: 1, group: "C", date: "2026-06-14T02:00:00Z", homeTeamTla: "HAI", awayTeamTla: "SCO", venue: "Hard Rock Stadium",        city: "Miami" },
  { matchday: 2, group: "C", date: "2026-06-18T22:00:00Z", homeTeamTla: "BRA", awayTeamTla: "HAI", venue: "SoFi Stadium",            city: "Los Angeles" },
  { matchday: 2, group: "C", date: "2026-06-19T02:00:00Z", homeTeamTla: "MAR", awayTeamTla: "SCO", venue: "Levi's Stadium",          city: "San Francisco" },
  { matchday: 3, group: "C", date: "2026-06-23T02:00:00Z", homeTeamTla: "BRA", awayTeamTla: "SCO", venue: "MetLife Stadium",          city: "New York/NJ" },
  { matchday: 3, group: "C", date: "2026-06-23T02:00:00Z", homeTeamTla: "MAR", awayTeamTla: "HAI", venue: "AT&T Stadium",            city: "Dallas" },

  // ── GROUP D: USA, Paraguay, Australia, Türkiye ──
  { matchday: 1, group: "D", date: "2026-06-14T21:00:00Z", homeTeamTla: "USA", awayTeamTla: "PAR", venue: "MetLife Stadium",          city: "New York/NJ" },
  { matchday: 1, group: "D", date: "2026-06-15T01:00:00Z", homeTeamTla: "AUS", awayTeamTla: "TUR", venue: "SoFi Stadium",            city: "Los Angeles" },
  { matchday: 2, group: "D", date: "2026-06-19T21:00:00Z", homeTeamTla: "USA", awayTeamTla: "AUS", venue: "Levi's Stadium",          city: "San Francisco" },
  { matchday: 2, group: "D", date: "2026-06-20T01:00:00Z", homeTeamTla: "PAR", awayTeamTla: "TUR", venue: "AT&T Stadium",            city: "Dallas" },
  { matchday: 3, group: "D", date: "2026-06-24T01:00:00Z", homeTeamTla: "USA", awayTeamTla: "TUR", venue: "MetLife Stadium",          city: "New York/NJ" },
  { matchday: 3, group: "D", date: "2026-06-24T01:00:00Z", homeTeamTla: "PAR", awayTeamTla: "AUS", venue: "Hard Rock Stadium",       city: "Miami" },

  // ── GROUP E: Germany, Curaçao, Côte d'Ivoire, Ecuador ──
  { matchday: 1, group: "E", date: "2026-06-15T21:00:00Z", homeTeamTla: "GER", awayTeamTla: "CUW", venue: "MetLife Stadium",          city: "New York/NJ" },
  { matchday: 1, group: "E", date: "2026-06-16T01:00:00Z", homeTeamTla: "CIV", awayTeamTla: "ECU", venue: "AT&T Stadium",            city: "Dallas" },
  { matchday: 2, group: "E", date: "2026-06-20T21:00:00Z", homeTeamTla: "GER", awayTeamTla: "CIV", venue: "Levi's Stadium",          city: "San Francisco" },
  { matchday: 2, group: "E", date: "2026-06-21T01:00:00Z", homeTeamTla: "CUW", awayTeamTla: "ECU", venue: "NRG Stadium",             city: "Houston" },
  { matchday: 3, group: "E", date: "2026-06-25T01:00:00Z", homeTeamTla: "GER", awayTeamTla: "ECU", venue: "MetLife Stadium",          city: "New York/NJ" },
  { matchday: 3, group: "E", date: "2026-06-25T01:00:00Z", homeTeamTla: "CIV", awayTeamTla: "CUW", venue: "SoFi Stadium",           city: "Los Angeles" },

  // ── GROUP F: Netherlands, Japan, Sweden, Tunisia ──
  { matchday: 1, group: "F", date: "2026-06-16T21:00:00Z", homeTeamTla: "NED", awayTeamTla: "JPN", venue: "Hard Rock Stadium",       city: "Miami" },
  { matchday: 1, group: "F", date: "2026-06-17T01:00:00Z", homeTeamTla: "SWE", awayTeamTla: "TUN", venue: "Gillette Stadium",        city: "Boston" },
  { matchday: 2, group: "F", date: "2026-06-21T21:00:00Z", homeTeamTla: "NED", awayTeamTla: "SWE", venue: "AT&T Stadium",            city: "Dallas" },
  { matchday: 2, group: "F", date: "2026-06-22T01:00:00Z", homeTeamTla: "JPN", awayTeamTla: "TUN", venue: "SoFi Stadium",           city: "Los Angeles" },
  { matchday: 3, group: "F", date: "2026-06-26T01:00:00Z", homeTeamTla: "NED", awayTeamTla: "TUN", venue: "Hard Rock Stadium",      city: "Miami" },
  { matchday: 3, group: "F", date: "2026-06-26T01:00:00Z", homeTeamTla: "JPN", awayTeamTla: "SWE", venue: "Levi's Stadium",        city: "San Francisco" },

  // ── GROUP G: Belgium, Egypt, Iran, New Zealand ──
  { matchday: 1, group: "G", date: "2026-06-17T21:00:00Z", homeTeamTla: "BEL", awayTeamTla: "EGY", venue: "SoFi Stadium",           city: "Los Angeles" },
  { matchday: 1, group: "G", date: "2026-06-18T01:00:00Z", homeTeamTla: "IRN", awayTeamTla: "NZL", venue: "Levi's Stadium",         city: "San Francisco" },
  { matchday: 2, group: "G", date: "2026-06-22T21:00:00Z", homeTeamTla: "BEL", awayTeamTla: "IRN", venue: "MetLife Stadium",        city: "New York/NJ" },
  { matchday: 2, group: "G", date: "2026-06-23T01:00:00Z", homeTeamTla: "EGY", awayTeamTla: "NZL", venue: "Hard Rock Stadium",      city: "Miami" },
  { matchday: 3, group: "G", date: "2026-06-27T01:00:00Z", homeTeamTla: "BEL", awayTeamTla: "NZL", venue: "AT&T Stadium",          city: "Dallas" },
  { matchday: 3, group: "G", date: "2026-06-27T01:00:00Z", homeTeamTla: "EGY", awayTeamTla: "IRN", venue: "Gillette Stadium",      city: "Boston" },

  // ── GROUP H: Spain, Cabo Verde, Saudi Arabia, Uruguay ──
  { matchday: 1, group: "H", date: "2026-06-18T21:00:00Z", homeTeamTla: "ESP", awayTeamTla: "CPV", venue: "AT&T Stadium",            city: "Dallas" },
  { matchday: 1, group: "H", date: "2026-06-19T01:00:00Z", homeTeamTla: "SAU", awayTeamTla: "URU", venue: "NRG Stadium",             city: "Houston" },
  { matchday: 2, group: "H", date: "2026-06-23T21:00:00Z", homeTeamTla: "ESP", awayTeamTla: "SAU", venue: "Levi's Stadium",          city: "San Francisco" },
  { matchday: 2, group: "H", date: "2026-06-24T01:00:00Z", homeTeamTla: "CPV", awayTeamTla: "URU", venue: "SoFi Stadium",           city: "Los Angeles" },
  { matchday: 3, group: "H", date: "2026-06-28T01:00:00Z", homeTeamTla: "ESP", awayTeamTla: "URU", venue: "Hard Rock Stadium",      city: "Miami" },
  { matchday: 3, group: "H", date: "2026-06-28T01:00:00Z", homeTeamTla: "CPV", awayTeamTla: "SAU", venue: "MetLife Stadium",        city: "New York/NJ" },

  // ── GROUP I: France, Senegal, Iraq, Norway ──
  { matchday: 1, group: "I", date: "2026-06-19T21:00:00Z", homeTeamTla: "FRA", awayTeamTla: "SEN", venue: "MetLife Stadium",         city: "New York/NJ" },
  { matchday: 1, group: "I", date: "2026-06-20T01:00:00Z", homeTeamTla: "IRQ", awayTeamTla: "NOR", venue: "Hard Rock Stadium",       city: "Miami" },
  { matchday: 2, group: "I", date: "2026-06-24T21:00:00Z", homeTeamTla: "FRA", awayTeamTla: "IRQ", venue: "AT&T Stadium",            city: "Dallas" },
  { matchday: 2, group: "I", date: "2026-06-25T01:00:00Z", homeTeamTla: "SEN", awayTeamTla: "NOR", venue: "SoFi Stadium",           city: "Los Angeles" },
  { matchday: 3, group: "I", date: "2026-06-29T01:00:00Z", homeTeamTla: "FRA", awayTeamTla: "NOR", venue: "MetLife Stadium",         city: "New York/NJ" },
  { matchday: 3, group: "I", date: "2026-06-29T01:00:00Z", homeTeamTla: "SEN", awayTeamTla: "IRQ", venue: "Levi's Stadium",         city: "San Francisco" },

  // ── GROUP J: Argentina, Algeria, Austria, Jordan ──
  { matchday: 1, group: "J", date: "2026-06-20T21:00:00Z", homeTeamTla: "ARG", awayTeamTla: "ALG", venue: "MetLife Stadium",         city: "New York/NJ" },
  { matchday: 1, group: "J", date: "2026-06-21T01:00:00Z", homeTeamTla: "AUT", awayTeamTla: "JOR", venue: "AT&T Stadium",            city: "Dallas" },
  { matchday: 2, group: "J", date: "2026-06-25T21:00:00Z", homeTeamTla: "ARG", awayTeamTla: "AUT", venue: "Hard Rock Stadium",       city: "Miami" },
  { matchday: 2, group: "J", date: "2026-06-26T01:00:00Z", homeTeamTla: "ALG", awayTeamTla: "JOR", venue: "NRG Stadium",             city: "Houston" },
  { matchday: 3, group: "J", date: "2026-06-30T01:00:00Z", homeTeamTla: "ARG", awayTeamTla: "JOR", venue: "Levi's Stadium",          city: "San Francisco" },
  { matchday: 3, group: "J", date: "2026-06-30T01:00:00Z", homeTeamTla: "ALG", awayTeamTla: "AUT", venue: "SoFi Stadium",           city: "Los Angeles" },

  // ── GROUP K: Portugal, DR Congo, Uzbekistan, Colombia ──
  { matchday: 1, group: "K", date: "2026-06-21T21:00:00Z", homeTeamTla: "POR", awayTeamTla: "COD", venue: "Levi's Stadium",          city: "San Francisco" },
  { matchday: 1, group: "K", date: "2026-06-22T01:00:00Z", homeTeamTla: "UZB", awayTeamTla: "COL", venue: "SoFi Stadium",           city: "Los Angeles" },
  { matchday: 2, group: "K", date: "2026-06-26T21:00:00Z", homeTeamTla: "POR", awayTeamTla: "UZB", venue: "MetLife Stadium",         city: "New York/NJ" },
  { matchday: 2, group: "K", date: "2026-06-27T01:00:00Z", homeTeamTla: "COD", awayTeamTla: "COL", venue: "AT&T Stadium",            city: "Dallas" },
  { matchday: 3, group: "K", date: "2026-07-01T01:00:00Z", homeTeamTla: "POR", awayTeamTla: "COL", venue: "Hard Rock Stadium",      city: "Miami" },
  { matchday: 3, group: "K", date: "2026-07-01T01:00:00Z", homeTeamTla: "COD", awayTeamTla: "UZB", venue: "Gillette Stadium",      city: "Boston" },

  // ── GROUP L: England, Croatia, Ghana, Panama ──
  { matchday: 1, group: "L", date: "2026-06-22T21:00:00Z", homeTeamTla: "ENG", awayTeamTla: "CRO", venue: "AT&T Stadium",            city: "Dallas" },
  { matchday: 1, group: "L", date: "2026-06-23T01:00:00Z", homeTeamTla: "GHA", awayTeamTla: "PAN", venue: "NRG Stadium",             city: "Houston" },
  { matchday: 2, group: "L", date: "2026-06-27T21:00:00Z", homeTeamTla: "ENG", awayTeamTla: "GHA", venue: "SoFi Stadium",           city: "Los Angeles" },
  { matchday: 2, group: "L", date: "2026-06-28T01:00:00Z", homeTeamTla: "CRO", awayTeamTla: "PAN", venue: "Levi's Stadium",         city: "San Francisco" },
  { matchday: 3, group: "L", date: "2026-07-02T01:00:00Z", homeTeamTla: "ENG", awayTeamTla: "PAN", venue: "MetLife Stadium",         city: "New York/NJ" },
  { matchday: 3, group: "L", date: "2026-07-02T01:00:00Z", homeTeamTla: "CRO", awayTeamTla: "GHA", venue: "Hard Rock Stadium",      city: "Miami" },
];

export function getGroupFixtures(group: string): WCFixture[] {
  return WC2026_GROUP_FIXTURES.filter((f) => f.group === group);
}

export function getTeamFixturesFromSchedule(tla: string): WCFixture[] {
  const t = tla.toUpperCase();
  return WC2026_GROUP_FIXTURES.filter(
    (f) => f.homeTeamTla === t || f.awayTeamTla === t
  );
}

export function getNextFixture(tla: string): WCFixture | null {
  const now = new Date();
  const upcoming = getTeamFixturesFromSchedule(tla)
    .filter((f) => new Date(f.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return upcoming[0] ?? null;
}
