"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, AnalysisStreamChunk } from "@/types";
import { cn } from "@/lib/utils";

interface AIScoutChatProps {
  teamATla: string;
  teamBTla: string;
  teamAName: string;
  teamBName: string;
  autoAnalyze?: boolean;
}

interface DisplayMessage {
  role: "user" | "assistant" | "system";
  content: string;
  isStreaming?: boolean;
  toolCalls?: string[];
}

export default function AIScoutChat({
  teamATla,
  teamBTla,
  teamAName,
  teamBName,
  autoAnalyze = true,
}: AIScoutChatProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasAutoAnalyzed = useRef(false);

  useEffect(() => {
    if (autoAnalyze && !hasAutoAnalyzed.current) {
      hasAutoAnalyzed.current = true;
      runAnalysis("", true);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function runAnalysis(userQuestion: string, isInitial = false) {
    if (isLoading) return;
    setIsLoading(true);
    setActiveTools([]);

    const userMsg = isInitial
      ? `Analyze ${teamAName} vs ${teamBName} for the World Cup`
      : userQuestion;

    // Add user message to display (skip for initial auto-analysis)
    if (!isInitial) {
      setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    }

    // Add streaming assistant placeholder
    const assistantMsgIndex = isInitial ? 0 : messages.length + 1;
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
          question: isInitial ? "" : userQuestion,
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

              // Update conversation history for follow-ups
              const newHistory: ChatMessage[] = [
                ...conversationHistory,
                ...(isInitial ? [] : [{ role: "user" as const, content: userQuestion }]),
                { role: "assistant" as const, content: assistantText },
              ];
              setConversationHistory(newHistory);
            }
          } catch {
            // Malformed JSON chunk — skip
          }
        }
      }
    } catch (err) {
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
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const q = input.trim();
    setInput("");
    runAnalysis(q);
  }

  const TOOL_LABELS: Record<string, string> = {
    get_squad: "Fetching squads",
    get_recent_form: "Loading recent form",
    get_head_to_head: "Checking H2H record",
    get_team_stats: "Pulling team stats",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && !isLoading && (
          <div className="text-white/30 text-sm text-center py-8 font-['Space_Mono']">
            Loading scout analysis...
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3", msg.role === "user" && "justify-end")}>
            {msg.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(255,219,0,0.15)" }}
              >
                <span className="text-xs" style={{ color: "var(--wc-gold)" }}>⚡</span>
              </div>
            )}
            <div
              className="rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%]"
              style={
                msg.role === "user"
                  ? { background: "rgba(255,255,255,0.08)", color: "var(--wc-white)", marginLeft: "auto" }
                  : { background: "var(--wc-gray-900)", border: "1px solid var(--wc-gray-700)", color: "var(--wc-gray-200)" }
              }
            >
              {/* Tool calls indicator */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {msg.toolCalls.map((tool, ti) => (
                    <span
                      key={`${tool}-${ti}`}
                      className="text-[10px] px-2 py-0.5 rounded-full font-['Space_Mono']"
                      style={{
                        background: "rgba(255,219,0,0.10)",
                        color: "var(--wc-gold)",
                        border: "1px solid rgba(255,219,0,0.2)",
                      }}
                    >
                      ✓ {TOOL_LABELS[tool] ?? tool}
                    </span>
                  ))}
                </div>
              )}

              {/* Message content */}
              <div style={{ whiteSpace: "pre-wrap" }}>
                {msg.content}
                {msg.isStreaming && (
                  <span className="inline-block w-0.5 h-4 animate-pulse ml-0.5 align-middle" style={{ background: "var(--wc-gold)" }} />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Active tool loading state */}
        {isLoading && activeTools.length > 0 && (
          <div className="flex gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,219,0,0.15)" }}
            >
              <span className="text-xs animate-spin" style={{ color: "var(--wc-gold)" }}>⚡</span>
            </div>
            <div
              className="rounded-2xl px-4 py-3 text-sm border"
              style={{ background: "var(--wc-gray-900)", borderColor: "var(--wc-gray-700)" }}
            >
              <div className="flex flex-wrap gap-1.5">
                {activeTools.map((tool) => (
                  <span
                    key={tool}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-['Space_Mono'] border border-amber-500/20"
                  >
                    ⟳ {TOOL_LABELS[tool] ?? tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
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
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 rounded font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "var(--wc-gold)",
            color: "var(--wc-black)",
            fontFamily: "'Aldrich', sans-serif",
          }}
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) (e.currentTarget as HTMLButtonElement).style.background = "var(--wc-gold-dark)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--wc-gold)"; }}
        >
          →
        </button>
      </form>
    </div>
  );
}
