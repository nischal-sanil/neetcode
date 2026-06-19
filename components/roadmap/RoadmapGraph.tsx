"use client"

import { useMemo } from "react"
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"

import { TooltipProvider } from "@/components/ui/tooltip"

import { TopicNode, type TopicFlowNode } from "./TopicNode"

export interface RoadmapNode {
  id: string
  label: string
  position: { x: number; y: number }
  blurb: string
  order: number
  total: number
  solved: number
  available: boolean
  recommended: boolean
  complete: boolean
}

export interface RoadmapEdge {
  id: string
  source: string
  target: string
  active: boolean
}

const nodeTypes = { topic: TopicNode }

export function RoadmapGraph({
  nodes,
  edges,
}: {
  nodes: RoadmapNode[]
  edges: RoadmapEdge[]
}) {
  const flowNodes = useMemo<TopicFlowNode[]>(
    () =>
      nodes.map((n) => ({
        id: n.id,
        type: "topic",
        position: n.position,
        // Width is fixed in the node; this gives React Flow a sane bbox.
        data: {
          label: n.label,
          blurb: n.blurb,
          order: n.order,
          total: n.total,
          solved: n.solved,
          available: n.available,
          recommended: n.recommended,
          complete: n.complete,
        },
        draggable: false,
        connectable: false,
        selectable: true,
      })),
    [nodes]
  )

  const flowEdges = useMemo<Edge[]>(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: "smoothstep",
        animated: e.active,
        style: {
          stroke: e.active
            ? "var(--primary)"
            : "color-mix(in oklch, var(--foreground) 22%, transparent)",
          strokeWidth: e.active ? 1.75 : 1.25,
          opacity: e.active ? 0.9 : 0.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: e.active
            ? "var(--primary)"
            : "color-mix(in oklch, var(--foreground) 30%, transparent)",
        },
      })),
    [edges]
  )

  return (
    <div className="relative min-h-0 w-full flex-1">
      <ReactFlowProvider>
        <TooltipProvider delay={140}>
          <ReactFlow
            nodes={flowNodes as Node[]}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.18, maxZoom: 1 }}
            minZoom={0.4}
            maxZoom={1.6}
            defaultEdgeOptions={{ type: "smoothstep" }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable
            panOnScroll
            selectionOnDrag={false}
            proOptions={{ hideAttribution: true }}
            className="[--xy-edge-stroke-default:var(--edge)]"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={28}
              size={1}
              color="color-mix(in oklch, var(--foreground) 9%, transparent)"
            />
            <Controls
              showInteractive={false}
              className="!border-edge !bg-surface-raised [&_button]:!border-edge [&_button]:!bg-surface-raised [&_button]:!fill-foreground [&_button:hover]:!bg-surface"
            />
          </ReactFlow>
        </TooltipProvider>
      </ReactFlowProvider>
    </div>
  )
}
