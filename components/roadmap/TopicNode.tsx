"use client"

import { useRouter } from "next/navigation"
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProgressRing } from "@/components/ui/progress-ring"

export interface TopicNodeData extends Record<string, unknown> {
  label: string
  blurb: string
  order: number
  total: number
  solved: number
  available: boolean
  recommended: boolean
  complete: boolean
}

export type TopicFlowNode = Node<TopicNodeData, "topic">

const NODE_WIDTH = 196

export function TopicNode({ id, data, selected }: NodeProps<TopicFlowNode>) {
  const router = useRouter()
  const { label, blurb, order, total, solved, available, recommended, complete } =
    data

  const fraction = total > 0 ? solved / total : 0
  const ringLabel = complete ? (
    <Check className="size-4 text-primary" strokeWidth={3} />
  ) : (
    `${solved}/${total}`
  )

  // De-emphasize topics whose prerequisites you haven't started — never lock.
  const dimmed = !available && !recommended && !complete && solved === 0

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={() => router.push(`/topic/${id}`)}
            style={{ width: NODE_WIDTH }}
            className={cn(
              "group panel relative flex items-center gap-3 px-3.5 py-3 text-left",
              "transition-[opacity,transform,box-shadow,border-color] duration-200 ease-out",
              "hover:-translate-y-0.5 hover:border-primary/40",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              recommended && "glow-accent border-primary/50",
              complete && "border-primary/30",
              selected && "border-primary/60",
              dimmed && "opacity-45 hover:opacity-100"
            )}
          />
        }
      >
          {/* Prerequisite handles: top = depends on what's above, bottom = unlocks below */}
          <Handle
            type="target"
            position={Position.Top}
            className="!h-1.5 !w-1.5 !border-0 !bg-edge"
            isConnectable={false}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="!h-1.5 !w-1.5 !border-0 !bg-edge"
            isConnectable={false}
          />

          {recommended && (
            <span className="absolute -top-2 left-3 rounded-full bg-primary px-1.5 py-px text-[0.5625rem] font-semibold uppercase tracking-wide text-primary-foreground shadow-sm">
              Next up
            </span>
          )}

          <ProgressRing
            value={fraction}
            size={42}
            stroke={4}
            label={ringLabel}
          />

          <div className="min-w-0 flex-1">
            <span className="font-mono text-[0.625rem] tabular-nums text-muted-foreground">
              {String(order).padStart(2, "0")}
            </span>
            <div className="truncate font-display text-sm font-semibold leading-tight text-foreground">
              {label}
            </div>
            <div className="mt-0.5 text-[0.6875rem] tabular-nums text-muted-foreground">
              {solved} of {total} solved
            </div>
          </div>
      </TooltipTrigger>

      <TooltipContent
        side="right"
        sideOffset={10}
        className="max-w-[15rem] border-edge bg-surface-raised text-foreground"
      >
        <div className="font-display text-sm font-semibold">{label}</div>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">{blurb}</p>
        <div className="mt-2 flex items-center justify-between text-[0.6875rem] tabular-nums text-muted-foreground">
          <span>{complete ? "Complete" : `${solved}/${total} solved`}</span>
          {!available && solved === 0 && (
            <span className="text-muted-foreground/70">prereqs not started</span>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
