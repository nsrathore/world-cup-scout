import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  return NextResponse.json({
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    keyLength: process.env.ANTHROPIC_API_KEY?.length ?? 0,
    keyPrefix: process.env.ANTHROPIC_API_KEY?.slice(0, 15) ?? "MISSING",
    hasBSD: !!process.env.BSD_API_KEY,
    cwd: process.cwd(),
  });
}
