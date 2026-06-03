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

export const runtime = "nodejs"; // Edge runtime doesn't support all Anthropic SDK features
export const maxDuration = 60;   // Allow up to 60s for the full agent loop

export async function POST(req: NextRequest) {
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
