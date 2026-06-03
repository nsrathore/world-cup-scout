/**
 * POST /api/analyze
 *
 * Runs the Claude tool-use agent and streams results back as Server-Sent Events.
 *
 * Request body:
 *   { teamA: "BRA", teamB: "FRA", question?: string, conversationHistory?: ChatMessage[] }
 *
 * Response: text/event-stream
 *   Each event is: data: { type, ...payload }\n\n
 */

import { NextRequest, NextResponse } from "next/server";
import { createAnalysisStream } from "@/lib/claude";
import { AnalysisRequest } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

// Simple in-memory rate limiter: 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 25;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = (await req.json()) as AnalysisRequest;
    const { teamA, teamB, question = "", conversationHistory = [] } = body;

    if (!teamA || !teamB) {
      return NextResponse.json(
        { error: "teamA and teamB are required" },
        { status: 400 }
      );
    }

    if (teamA.toUpperCase() === teamB.toUpperCase()) {
      return NextResponse.json(
        { error: "Teams must be different" },
        { status: 400 }
      );
    }

    // Create the streaming response
    const stream = createAnalysisStream(
      teamA.toUpperCase(),
      teamB.toUpperCase(),
      question,
      conversationHistory
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // Disable Nginx buffering for SSE
      },
    });
  } catch (err) {
    console.error("[/api/analyze] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
