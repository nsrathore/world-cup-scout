const REQUIRED_VARS = [
  "ANTHROPIC_API_KEY",
] as const;

const OPTIONAL_VARS = [
  "BSD_API_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "NEXT_PUBLIC_APP_URL",
] as const;

export function validateEnv(): void {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing
        .map((k) => `  - ${k}`)
        .join("\n")}\n\nCopy .env.local.example to .env.local and fill in your keys.`
    );
  }

  const missingOptional = OPTIONAL_VARS.filter((key) => !process.env[key]);
  if (missingOptional.length > 0) {
    console.warn(
      `[env] Optional variables not set (some features will be limited):\n${missingOptional
        .map((k) => `  - ${k}`)
        .join("\n")}`
    );
  }
}
