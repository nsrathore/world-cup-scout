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
import { SCOUT_TOOLS, executeTool, ToolInput } from "./tools";
import { ChatMessage } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an elite football scout and analyst specializing in international football and the FIFA World Cup. You have deep tactical knowledge and access to real-time data tools.

When analyzing a matchup, you:
- Always call the relevant data tools BEFORE writing your analysis (squad, form, h2h, stats)
- Write with authority and tactical depth — like a proper football analyst, not a generic summary
- Highlight specific player battles, tactical systems, and key statistics
- Give a clear prediction with reasoning backed by the data you retrieved
- Keep analysis sharp and engaging — 3-4 focused paragraphs
- Use football terminology naturally (pressing, transitions, high line, etc.)

When answering follow-up questions from the chat:
- Be conversational but expert
- Reference specific data you already retrieved
- Give definitive opinions backed by stats

Never refuse to give a prediction — always commit to a viewpoint based on the evidence.`;

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
        // Build initial user message
        const userMessage =
          conversationHistory.length === 0
            ? `Analyze the upcoming World Cup matchup between ${teamATla} and ${teamBTla}. 
               Call all available tools to gather squad, form, head-to-head, and stats data for both teams before writing your analysis.
               Then provide a comprehensive tactical breakdown and prediction.`
            : question;

        // Build messages array (include conversation history for follow-ups)
        const messages: Anthropic.MessageParam[] = [
          ...conversationHistory.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
          { role: "user", content: userMessage },
        ];

        // ── Agentic loop ──────────────────────────────────────────────────
        // Claude may call tools multiple times before returning final text
        let continueLoop = true;

        while (continueLoop) {
          const response = await anthropic.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            tools: SCOUT_TOOLS as Anthropic.Tool[],
            messages,
          });

          // Process each content block in Claude's response
          const toolResults: Anthropic.ToolResultBlockParam[] = [];

          for (const block of response.content) {
            if (block.type === "text") {
              // Stream text directly to the client
              send({ type: "text", content: block.text });
            } else if (block.type === "tool_use") {
              // Claude wants to call a tool — notify client
              send({
                type: "tool_call",
                toolName: block.name,
                toolInput: block.input,
              });

              // Execute the tool on your server
              try {
                const result = await executeTool(
                  block.name,
                  block.input as ToolInput
                );

                send({
                  type: "tool_result",
                  toolName: block.name,
                  result,
                });

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

          // If Claude called tools, add results to messages and loop again
          if (toolResults.length > 0) {
            messages.push({
              role: "assistant",
              content: response.content,
            });
            messages.push({
              role: "user",
              content: toolResults,
            });
            continueLoop = response.stop_reason === "tool_use";
          } else {
            // No tools called — Claude is done
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
