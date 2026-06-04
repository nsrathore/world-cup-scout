"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage, AnalysisStreamChunk } from "@/types";
import { cn } from "@/lib/utils";

interface AIScoutChatProps {
  teamATla: string;
  teamBTla: string;
  teamAName: string;
  teamBName: string;
  autoAnalyze?: boolean; // retained for API compatibility but no longer used
}

interface DisplayMessage {
  role: "user" | "assistant" | "system";
  content: string;
  isStreaming?: boolean;
  toolCalls?: string[];
}

// ─── Lightweight markdown → HTML renderer ────────────────────────────────────
// Content comes exclusively from the Anthropic API — never from user input —
// so dangerouslySetInnerHTML is safe here.
function renderMarkdown(text: string): string {
  return text
    // Headers: ### and ##
    .replace(/^### (.+)$/gm, '<p class="font-bold text-white mt-3 mb-1">$1</p>')
    .replace(/^## (.+)$/gm, '<p class="font-bold text-white/90 text-base mt-4 mb-1">$1</p>')
    // Bold: **text**
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // Italic: *text*
    .replace(/\*(.+?)\*/g, '<em class="text-white/80">$1</em>')
    // Bullet points: lines starting with "- " or "• "
    .replace(/^[-•] (.+)$/gm, '<div class="flex gap-2 my-0.5"><span class="text-[#00ff87] flex-shrink-0">›</span><span>$1</span></div>')
    // Numbered lists: "1. text" — capture number and text separately
    .replace(/^(\d+)\. (.+)$/gm, '<div class="flex gap-2 my-0.5"><span class="text-[#00ff87] flex-shrink-0 font-mono text-xs mt-0.5">$1.</span><span>$2</span></div>')
    // Double newline → paragraph gap
    .replace(/\n\n/g, '<div class="mt-2"></div>')
    // Single newline → line break
    .replace(/\n/g, '<br/>');
}

const TOOL_LABELS: Record<string, string> = {
  get_squad: "Fetching squads",
  get_recent_form: "Loading recent form",
  get_head_to_head: "Checking H2H record",
  get_team_stats: "Pulling team stats",
};

export default function AIScoutChat({
  teamATla,
  teamBTla,
  teamAName,
  teamBName,
}: AIScoutChatProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_QUESTIONS = [
    `Who are the key players to watch in ${teamAName} vs ${teamBName}?`,
    `What tactical system does ${teamAName} use and how does it match up against ${teamBName}?`,
    `What does the head-to-head history tell us about this fixture?`,
    `Which team has better recent form going into this match?`,
    `Who wins and why? Give me your prediction.`,
    `What are ${teamAName}'s biggest strengths and weaknesses?`,
    `What are ${teamBName}'s biggest strengths and weaknesses?`,
    `Who wins the midfield battle?`,
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const runAnalysis = useCallback(async (userQuestion: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setHasStarted(true);
    setActiveTools([]);

    // Always add the question as a visible user message
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", isStreaming: true, toolCalls: [] },
    ]);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamA: teamATla,
          teamB: teamBTla,
          question: userQuestion,
          conversationHistory,
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      const toolCallsMade: string[] = [];
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const chunk: AnalysisStreamChunk = JSON.parse(line.slice(6));

            if (chunk.type === "text" && chunk.content) {
              assistantText += chunk.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                  isStreaming: true,
                  toolCalls: toolCallsMade,
                };
                return updated;
              });
            } else if (chunk.type === "tool_call" && chunk.toolName) {
              toolCallsMade.push(chunk.toolName);
              setActiveTools([...toolCallsMade]);
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  toolCalls: [...toolCallsMade],
                };
                return updated;
              });
            } else if (chunk.type === "done") {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                  isStreaming: false,
                  toolCalls: toolCallsMade,
                };
                return updated;
              });

              const newHistory: ChatMessage[] = [
                ...conversationHistory,
                { role: "user" as const, content: userQuestion },
                { role: "assistant" as const, content: assistantText },
              ];
              setConversationHistory(newHistory);
            } else if (chunk.type === "error" && chunk.error) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: `Scout analysis failed: ${chunk.error}`,
                  isStreaming: false,
                };
                return updated;
              });
            }
          } catch {
            // Malformed JSON chunk — skip
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Failed to load analysis. Check your API keys and try again.",
          isStreaming: false,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      setActiveTools([]);
      // If the last message is still marked streaming with no done event received
      // (network drop, server crash, timeout), show a fallback instead of a
      // permanent blinking cursor with no text.
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.isStreaming) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...last,
            isStreaming: false,
            content: last.content.trim() ||
              "Analysis incomplete — the stream closed unexpectedly. Please try again.",
          };
          return updated;
        }
        return prev;
      });
    }
  }, [isLoading, conversationHistory, teamATla, teamBTla]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const q = input.trim();
    setInput("");
    setHasStarted(true);
    runAnalysis(q);
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Message list ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && !isLoading && !hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col gap-4 py-4"
          >
            {/* Greeting bubble */}
            <div className="flex gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(0,255,135,0.15)" }}
              >
                <span className="text-xs" style={{ color: "#00ff87" }}>⚡</span>
              </div>
              <div
                className="rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%]"
                style={{
                  background: "var(--wc-gray-900)",
                  border: "1px solid var(--wc-gray-700)",
                  color: "var(--wc-gray-200)",
                }}
              >
                I&apos;m your AI Scout for{" "}
                <strong className="text-white">{teamAName} vs {teamBName}</strong>.
                I have access to live squad data, recent form, and head-to-head
                records. What do you want to know?
              </div>
            </div>

            {/* Suggested question chips */}
            <div className="flex flex-wrap gap-2 pl-10">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setHasStarted(true);
                    setInput("");
                    runAnalysis(q);
                  }}
                  className="text-xs px-3 py-2 rounded-xl text-left transition-all"
                  style={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                    e.currentTarget.style.borderColor = "rgba(0,255,135,0.4)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn("flex gap-3", msg.role === "user" && "justify-end")}
            >
              {msg.role === "assistant" && (
                <motion.div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 will-change-transform"
                  style={{ background: "rgba(255,219,0,0.15)" }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <span className="text-xs" style={{ color: "var(--wc-gold)" }}>⚡</span>
                </motion.div>
              )}

              <div
                className="rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%]"
                style={
                  msg.role === "user"
                    ? {
                        background: "rgba(255,255,255,0.08)",
                        color: "var(--wc-white)",
                        marginLeft: "auto",
                      }
                    : {
                        background: "var(--wc-gray-900)",
                        border: "1px solid var(--wc-gray-700)",
                        color: "var(--wc-gray-200)",
                      }
                }
              >
                {/* Tool call badges — each springs in individually */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <AnimatePresence>
                      {msg.toolCalls.map((tool, ti) => (
                        <motion.span
                          key={`${tool}-${ti}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25, delay: ti * 0.05 }}
                          className="text-[10px] px-2 py-0.5 rounded-full font-['Space_Mono']"
                          style={{
                            background: "rgba(255,219,0,0.10)",
                            color: "var(--wc-gold)",
                            border: "1px solid rgba(255,219,0,0.2)",
                          }}
                        >
                          ✓ {TOOL_LABELS[tool] ?? tool}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Message content */}
                <div className="leading-relaxed">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(msg.content),
                    }}
                  />
                  {msg.isStreaming && (
                    <motion.span
                      className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                      style={{ background: "var(--wc-gold)" }}
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Active tool loading badges */}
        <AnimatePresence>
          {isLoading && activeTools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex gap-3"
            >
              <motion.div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 will-change-transform"
                style={{ background: "rgba(255,219,0,0.15)" }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <span className="text-xs" style={{ color: "var(--wc-gold)" }}>⚡</span>
              </motion.div>
              <div
                className="rounded-2xl px-4 py-3 text-sm border"
                style={{ background: "var(--wc-gray-900)", borderColor: "var(--wc-gray-700)" }}
              >
                <div className="flex flex-wrap gap-1.5">
                  {activeTools.map((tool, i) => (
                    <span
                      key={`active-${tool}-${i}`}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-['Space_Mono'] border border-amber-500/20"
                    >
                      ⟳ {TOOL_LABELS[tool] ?? tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── Thinking dots (shown above input while loading) ──────────────── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-1 justify-center py-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="text-xs"
                style={{ color: "var(--wc-gold)" }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: "easeInOut" }}
              >
                ●
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input form ───────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder={`Ask about ${teamAName} vs ${teamBName}...`}
          className="flex-1 rounded px-4 py-2.5 text-sm text-white outline-none transition-colors disabled:opacity-50"
          style={{
            background: "var(--wc-gray-800)",
            border: "1px solid var(--wc-gray-700)",
            fontFamily: "'Noto Sans', sans-serif",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,219,0,0.5)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--wc-gray-700)")}
        />
        <motion.button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 rounded font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed will-change-transform"
          style={{
            background: "var(--wc-gold)",
            color: "var(--wc-black)",
            fontFamily: "'Aldrich', sans-serif",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          →
        </motion.button>
      </form>
    </div>
  );
}
