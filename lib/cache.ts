/**
 * Redis cache using Upstash REST API
 * Free tier: 10k requests/day, 256MB storage
 * Sign up at: https://upstash.com
 *
 * If UPSTASH env vars are not set, falls through to direct API calls (no caching)
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const isCacheEnabled = Boolean(REDIS_URL && REDIS_TOKEN);

// Default TTLs in seconds
export const TTL = {
  SQUAD: 60 * 60 * 24,       // 24h — squads rarely change
  FIXTURES: 60 * 60 * 6,     // 6h  — recent results
  H2H: 60 * 60 * 24 * 7,    // 7d  — historical records barely change
  STATS: 60 * 60 * 12,       // 12h — player stats
  STANDINGS: 60 * 60 * 1,    // 1h  — standings update frequently
} as const;

async function redisCommand<T>(command: string[]): Promise<T | null> {
  if (!isCacheEnabled) return null;

  try {
    const res = await fetch(`${REDIS_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.result as T;
  } catch {
    // Cache errors should never crash the app
    return null;
  }
}

/**
 * Get a cached value by key
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const raw = await redisCommand<string>(["GET", key]);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Set a value in cache with TTL (seconds)
 */
export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  await redisCommand(["SET", key, JSON.stringify(value), "EX", String(ttlSeconds)]);
}

/**
 * Wrap an async function with cache-aside pattern
 * - Checks cache first
 * - On miss, calls fetchFn and stores the result
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    console.log(`[cache] HIT: ${key}`);
    return cached;
  }

  console.log(`[cache] MISS: ${key}`);
  const fresh = await fetchFn();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
}

// ─── Typed cache helpers ──────────────────────────────────────────────────

// Bump this string whenever IDs or data shapes change — invalidates all cached entries
const CACHE_V = "v2";

export const CacheKeys = {
  squad:       (teamId: number)                   => `${CACHE_V}:squad:${teamId}`,
  fixtures:    (teamId: number)                   => `${CACHE_V}:fixtures:${teamId}`,
  h2h:         (teamAId: number, teamBId: number) => `${CACHE_V}:h2h:${Math.min(teamAId, teamBId)}_${Math.max(teamAId, teamBId)}`,
  playerStats: (playerId: number)                 => `${CACHE_V}:player_stats:${playerId}`,
  standings:   ()                                 => `${CACHE_V}:wc2026:standings`,
};
