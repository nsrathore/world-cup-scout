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
        <span className="text-[10px] text-white/40 font-['Space_Mono'] uppercase tracking-wider">
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
  colorA = "#00ff87",
  colorB = "#3b82f6",
}: StatBarProps) {
  const max = maxValue ?? Math.max(valueA, valueB, 1);
  const pctA = Math.round((valueA / max) * 100);
  const pctB = Math.round((valueB / max) * 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-white/50 font-['Space_Mono']">
        <span style={{ color: colorA }}>{format(valueA)}</span>
        <span className="text-white/30">{label}</span>
        <span style={{ color: colorB }}>{format(valueB)}</span>
      </div>
      <div className="flex gap-1 h-1.5">
        {/* Team A bar (right-aligned) */}
        <div className="flex-1 bg-white/5 rounded-full overflow-hidden flex justify-end">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pctA}%`, background: colorA, opacity: 0.8 }}
          />
        </div>
        {/* Team B bar (left-aligned) */}
        <div className="flex-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pctB}%`, background: colorB, opacity: 0.8 }}
          />
        </div>
      </div>
    </div>
  );
}
