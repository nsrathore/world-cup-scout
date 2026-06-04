/**
 * Claude tool-use agent
 *
 * This is the core of the resume-worthy piece.
 * Pattern:
 *   1. Send user question + tool definitions to Claude
 *   2. Claude returns tool_use blocks (it decides which APIs to call)
 *   3. Your server executes those tool calls
 *   4. Send tool results back to Claude
 *   5. Claude streams its final analysis
 *
 * This loop repeats until Claude stops calling tools and returns text.
 */

import Anthropic from "@anthropic-ai/sdk";
import { fetch as undiciFetch } from "undici";
import { readFileSync } from "fs";
import { resolve } from "path";
import { SCOUT_TOOLS, executeTool, ToolInput } from "./tools";
import { ChatMessage } from "@/types";
// validateEnv is no longer used here — key validation is done in getClient()
// using the resolved value from getApiKey() rather than raw process.env.

// Client is instantiated lazily inside createAnalysisStream so it reads
// the API key at call time rather than at module-load time.
//
// Key-loading strategy:
//   1. Read directly from .env.local via @next/env with override=true.
//      This is necessary because Claude Code (and some CI environments)
//      pre-set ANTHROPIC_API_KEY="" in the shell environment, which causes
//      dotenv to skip the .env.local value since it won't override a key
//      that is already defined (even as empty string).
//   2. Fall back to process.env if the file-based value is also empty
//      (handles production where the key is injected via the platform).
//
// Fetch:
//   We pass undici's fetch explicitly instead of relying on global.fetch.
//   Next.js patches global.fetch with a caching/buffering layer for ISR —
//   that layer buffers the entire SSE response from the Anthropic API before
//   delivering it, making anthropic.messages.stream() appear to hang.
//   Undici's fetch is the raw Node.js HTTP client and streams properly.
/**
 * Read ANTHROPIC_API_KEY, preferring .env.local over process.env.
 *
 * Why not just process.env.ANTHROPIC_API_KEY?
 * Claude Code (and some CI setups) pre-inject ANTHROPIC_API_KEY="" into the
 * shell environment so the agent runtime can control which key is active.
 * dotenv / @next/env never overrides an already-defined env var (even ""),
 * so the .env.local value is silently ignored. Parsing the file directly
 * and stripping quotes gives us the real key regardless of shell state.
 */
function getApiKey(): string {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf8");
    const match = content.match(/^ANTHROPIC_API_KEY\s*=\s*"?([^"\n]+)"?\s*$/m);
    if (match?.[1]?.trim()) return match[1].trim();
  } catch {
    // .env.local missing or unreadable — fall through
  }
  return process.env.ANTHROPIC_API_KEY ?? "";
}

function getClient() {
  return new Anthropic({
    apiKey: getApiKey(),
    fetch: undiciFetch as unknown as typeof globalThis.fetch,
  });
}

const SYSTEM_PROMPT = `You are a sharp, opinionated football scout covering the FIFA World Cup 2026. You have access to live data tools.

RESPONSE RULES — follow these strictly on every reply:
- Maximum 150 words per response. Never exceed this.
- Lead with the single most important insight in the first sentence.
- Use bullet points for lists of 3 or more items, plain prose otherwise.
- Be direct and opinionated — pick a side, make a call, own it.
- No hedging phrases like "it remains to be seen", "could potentially", or "both teams have strengths". Be definitive.
- Bold only the most critical stat or name per response using **bold**.
- Never write an intro sentence that restates the question.
- Never write a closing summary sentence.

TOOL USE:
- Only call the tools you actually need to answer the specific question asked.
- For prediction questions: call get_recent_form and get_head_to_head.
- For player questions: call get_squad and get_player_stats.
- For tactical questions: call get_squad and get_team_stats.
- Never call all tools for every question — be selective.

FORMAT EXAMPLE for "who wins?":
**France win this** — their recent form (W5 D0) is elite and they have the H2H edge (3W 1D 1L). Brazil's attack is lethal but their defensive shape has been vulnerable to quick transitions, which is exactly how France like to play. Expect a 2-1 France win.`;

export type StreamEvent =
  | { type: "text"; content: string }
  | { type: "tool_call"; toolName: string; toolInput: unknown }
  | { type: "tool_result"; toolName: string; result: unknown }
  | { type: "done" }
  | { type: "error"; error: string };

/**
 * Run the agentic loop and stream events back via a ReadableStream.
 * The caller (API route) pipes this stream to the HTTP response.
 */
export function createAnalysisStream(
  teamATla: string,
  teamBTla: string,
  question: string,
  conversationHistory: ChatMessage[] = []
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      function send(event: StreamEvent) {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      }

      try {
        const anthropic = getClient();

        // Validate the resolved key (not process.env, which may be "" due to
        // Claude Code / CI pre-setting it as an empty placeholder).
        if (!anthropic.apiKey) {
          throw new Error(
            "ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the server."
          );
        }

        // Build messages array — every call is user-initiated
        const messages: Anthropic.MessageParam[] = [
          ...conversationHistory.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
          { role: "user", content: question },
        ];

        // ── Agentic loop ──────────────────────────────────────────────────
        // Claude may call tools multiple times before returning final text.
        // We use stream() instead of create() so text tokens are forwarded
        // to the client as they arrive — no waiting for the full response.
        let continueLoop = true;

        while (continueLoop) {
          const stream = anthropic.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            tools: SCOUT_TOOLS as Anthropic.Tool[],
            messages,
          });

          // Forward each text token to the client as it arrives
          stream.on("text", (text) => {
            send({ type: "text", content: text });
          });

          // Wait for the full message so we can process tool_use blocks
          const response = await stream.finalMessage();

          const toolResults: Anthropic.ToolResultBlockParam[] = [];

          for (const block of response.content) {
            if (block.type === "tool_use") {
              // Claude wants to call a tool — notify client
              send({
                type: "tool_call",
                toolName: block.name,
                toolInput: block.input,
              });

              try {
                const result = await executeTool(
                  block.name,
                  block.input as ToolInput
                );
                send({ type: "tool_result", toolName: block.name, result });
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: block.id,
                  content: JSON.stringify(result),
                });
              } catch (err) {
                const errorMsg =
                  err instanceof Error ? err.message : "Tool execution failed";
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: block.id,
                  content: `Error: ${errorMsg}`,
                  is_error: true,
                });
              }
            }
          }

          if (toolResults.length > 0) {
            messages.push({ role: "assistant", content: response.content });
            messages.push({ role: "user", content: toolResults });
            continueLoop = response.stop_reason === "tool_use";
          } else {
            continueLoop = false;
          }
        }

        send({ type: "done" });
        controller.close();
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Analysis failed";
        send({ type: "error", error: errorMsg });
        controller.close();
      }
    },
  });
}
