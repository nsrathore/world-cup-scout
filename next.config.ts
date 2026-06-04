import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix workspace-root inference when a stray package-lock.json exists in a
  // parent directory. Without this, Next.js/Turbopack loads .env.local from
  // the wrong directory, making server-only env vars (ANTHROPIC_API_KEY) invisible.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "crests.football-data.org",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
  // Exclude server-only SDK from client bundle
  serverExternalPackages: ["@anthropic-ai/sdk"],
};

export default nextConfig;
