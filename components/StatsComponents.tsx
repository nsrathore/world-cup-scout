"use client";

import { MatchResult } from "@/types";
import { cn } from "@/lib/utils";

interface FormBadgeProps {
  result: MatchResult;
  size?: "sm" | "md";
}

export function FormBadge({ result, size = "md" }: FormBadgeProps) {
  const colors = {
    W: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    D: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    L: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded font-bold border font-['Space_Mono']",
        colors[result],
        size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs"
      )}
    >
      {result}
    </span>
  );
}

interface FormStripProps {
  form: MatchResult[];
  label?: string;
  align?: "left" | "right";
}

export function FormStrip({ form, label, align = "left" }: FormStripProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", align === "right" && "items-end")}>
      {label && (
        <span className="text-[10px] uppercase tracking-wider font-['Space_Mono']" style={{ color: "var(--wc-gray-400)" }}>
          {label}
        </span>
      )}
      <div className={cn("flex gap-1", align === "right" && "flex-row-reverse")}>
        {form.slice(0, 5).map((r, i) => (
          <FormBadge key={i} result={r} size="sm" />
        ))}
      </div>
    </div>
  );
}

interface StatBarProps {
  label: string;
  valueA: number;
  valueB: number;
  maxValue?: number;
  format?: (v: number) => string;
  colorA?: string;
  colorB?: string;
}

export function StatBar({
  label,
  valueA,
  valueB,
  maxValue,
  format = (v) => String(v),
  colorA = "#FFDB00",
  colorB = "#FFFFFF",
}: StatBarProps) {
  const max = maxValue ?? Math.max(valueA, valueB, 1);
  const pctA = Math.round((valueA / max) * 100);
  const pctB = Math.round((valueB / max) * 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-['Space_Mono']" style={{ color: "#888888" }}>
        <span style={{ color: colorA }}>{format(valueA)}</span>
        <span>{label}</span>
        <span style={{ color: colorB }}>{format(valueB)}</span>
      </div>
      <div className="flex gap-1 h-1.5">
        {/* Team A bar (right-aligned) */}
        <div className="flex-1 rounded-full overflow-hidden flex justify-end" style={{ background: "var(--wc-gray-700)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pctA}%`, background: colorA, opacity: 0.85 }}
          />
        </div>
        {/* Team B bar (left-aligned) */}
        <div className="flex-1 rounded-full overflow-hidden" style={{ background: "var(--wc-gray-700)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pctB}%`, background: colorB, opacity: 0.85 }}
          />
        </div>
      </div>
    </div>
  );
}
