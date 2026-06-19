import {
  getCategories,
  getCategoriesGraph,
  getProblems,
} from "@/lib/data/content"
import { getProgressMap } from "@/lib/db/queries"

import { RoadmapGraph, type RoadmapEdge, type RoadmapNode } from "@/components/roadmap/RoadmapGraph"

export default async function Home() {
  const categories = getCategories()
  const { nodes, edges } = getCategoriesGraph()
  const problems = getProblems()
  const progress = await getProgressMap()

  // Per-category rollups: total problems, solved count, and whether any
  // problem in the category has been touched (attempted or solved).
  type Roll = { total: number; solved: number; started: boolean }
  const rolls = new Map<string, Roll>()
  for (const c of categories) {
    rolls.set(c.id, { total: 0, solved: 0, started: false })
  }
  for (const p of problems) {
    const r = rolls.get(p.category)
    if (!r) continue
    r.total += 1
    const st = progress[p.slug]?.status
    if (st === "solved") {
      r.solved += 1
      r.started = true
    } else if (st === "attempted") {
      r.started = true
    }
  }

  const byId = new Map(categories.map((c) => [c.id, c]))

  // A category's prerequisites are "available" when every prereq category has
  // been started. Root categories (no prereqs) are always available.
  function prereqsAvailable(id: string): boolean {
    const cat = byId.get(id)
    if (!cat || cat.prerequisites.length === 0) return true
    return cat.prerequisites.every((p) => rolls.get(p)?.started ?? false)
  }

  // The next-recommended node: the lowest study-order category that is
  // available, not yet complete, and (ideally) already in motion or unlocked.
  // Prefer one that is started-but-incomplete; else the earliest available one.
  let recommendedId: string | null = null
  const ordered = [...categories].sort((a, b) => a.order - b.order)
  const incomplete = ordered.filter((c) => {
    const r = rolls.get(c.id)!
    return r.solved < r.total && prereqsAvailable(c.id)
  })
  const inMotion = incomplete.find((c) => rolls.get(c.id)!.started)
  recommendedId = (inMotion ?? incomplete[0])?.id ?? null

  const nodeData: RoadmapNode[] = nodes.map((n) => {
    const r = rolls.get(n.id) ?? { total: 0, solved: 0, started: false }
    const cat = byId.get(n.id)
    return {
      id: n.id,
      label: n.label,
      position: n.position,
      blurb: cat?.blurb ?? "",
      order: cat?.order ?? 0,
      total: r.total,
      solved: r.solved,
      available: prereqsAvailable(n.id),
      recommended: n.id === recommendedId,
      complete: r.total > 0 && r.solved === r.total,
    }
  })

  const edgeData: RoadmapEdge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    // Light up an edge once its prerequisite has been started — the path
    // forward reads as "flowing" toward what you've unlocked.
    active: rolls.get(e.source)?.started ?? false,
  }))

  return <RoadmapGraph nodes={nodeData} edges={edgeData} />
}
