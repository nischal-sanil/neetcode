"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export interface ProgressRingProps {
  /** Completion fraction, 0..1. Clamped. */
  value: number
  /** Outer diameter in px. */
  size?: number
  /** Stroke width in px. */
  stroke?: number
  /**
   * Centered content. Pass a string for the default tabular label, or any
   * node for custom content (e.g. a count "4/9"). Omit for a bare ring.
   */
  label?: React.ReactNode
  /** Override the filled-arc color. Defaults to the amber accent. */
  color?: string
  /** Track (unfilled) color. */
  trackColor?: string
  /** Disable the fill animation (e.g. for SSR-ish static contexts). */
  animate?: boolean
  className?: string
}

/**
 * ProgressRing — a circular SVG progress indicator that animates its fill.
 *
 * The roadmap nodes use this to show "problems solved in this topic". The arc
 * starts at 12 o'clock and sweeps clockwise; the fill animates with a spring
 * whenever `value` changes (the "satisfying confirmation" motion).
 */
export function ProgressRing({
  value,
  size = 44,
  stroke = 4,
  label,
  color = "var(--primary)",
  trackColor = "var(--edge)",
  animate = true,
  className,
}: ProgressRingProps) {
  const v = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - v)

  return (
    <div
      className={cn(
        "relative inline-grid shrink-0 place-items-center",
        className
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(v * 100)}% complete`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : false}
          animate={{ strokeDashoffset: offset }}
          transition={
            animate
              ? { type: "spring", stiffness: 140, damping: 22 }
              : { duration: 0 }
          }
          style={
            v > 0
              ? { filter: "drop-shadow(0 0 5px color-mix(in oklch, var(--primary) 55%, transparent))" }
              : undefined
          }
        />
      </svg>
      {label != null && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center text-center text-[0.625rem] font-semibold leading-none tabular-nums text-foreground">
          {label}
        </span>
      )}
    </div>
  )
}
