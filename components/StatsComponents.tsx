"use client";

import { motion, type Variants } from "framer-motion";
import { MatchResult } from "@/types";
import { cn } from "@/lib/utils";

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const STAGGER: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

// ─── FormBadge ──────────────────────────────────────────────────────────────

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
    <motion.span
      className={cn(
        "inline-flex items-center justify-center rounded font-bold border font-['Space_Mono'] will-change-transform",
        colors[result],
        size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs"
      )}
      whileHover={{ scale: 1.2, rotate: [-5, 5, 0] as number[] }}
      transition={{ duration: 0.3 }}
    >
      {result}
    </motion.span>
  );
}

// ─── FormStrip ──────────────────────────────────────────────────────────────

interface FormStripProps {
  form: MatchResult[];
  label?: string;
  align?: "left" | "right";
}

export function FormStrip({ form, label, align = "left" }: FormStripProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", align === "right" && "items-end")}>
      {label && (
        <span
          className="text-[10px] uppercase tracking-wider font-['Space_Mono']"
          style={{ color: "var(--wc-gray-400)" }}
        >
          {label}
        </span>
      )}
      <motion.div
        className={cn("flex gap-1", align === "right" && "flex-row-reverse")}
        variants={STAGGER}
        initial="hidden"
        animate="visible"
      >
        {form.slice(0, 5).map((r, i) => (
          <motion.div key={i} variants={FADE_UP}>
            <FormBadge result={r} size="sm" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── StatBar ────────────────────────────────────────────────────────────────

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
        {/* Team A bar — right-aligned, animates from 0 */}
        <div
          className="flex-1 rounded-full overflow-hidden flex justify-end"
          style={{ background: "var(--wc-gray-700)" }}
        >
          <motion.div
            className="h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${pctA}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            style={{ background: colorA, opacity: 0.85 }}
          />
        </div>
        {/* Team B bar — left-aligned, animates from 0 */}
        <div
          className="flex-1 rounded-full overflow-hidden"
          style={{ background: "var(--wc-gray-700)" }}
        >
          <motion.div
            className="h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${pctB}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ background: colorB, opacity: 0.85 }}
          />
        </div>
      </div>
    </div>
  );
}
