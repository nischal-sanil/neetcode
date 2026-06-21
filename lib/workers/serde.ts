// Structured I/O (de)serialization shared by the JS worker and the Node
// verifier. Everything crosses the worker boundary as plain JSON; the node
// objects below exist only transiently inside a single call.
//
// The Python equivalents live in lib/workers/py_harness.py and MUST stay
// behaviourally identical — scripts/serde-parity.mjs guards against drift.
//
// No DOM / worker dependency here so it is importable from plain Node.

import type { IoType } from "./types";

// --- transient node shapes (structural; user classes are duck-compatible) ---

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}
interface ListNode {
  val: number;
  next: ListNode | null;
}
interface RandomListNode {
  val: number;
  next: RandomListNode | null;
  random: RandomListNode | null;
}
interface GraphNode {
  val: number;
  neighbors: GraphNode[];
}

const LIST_CAP = 10_000; // guards a buggy solution that forms an unintended cycle

// --- binary tree: LeetCode level-order array with nulls ---

export function buildTree(level: unknown): TreeNode | null {
  if (!Array.isArray(level) || level.length === 0 || level[0] == null) return null;
  const root: TreeNode = { val: level[0] as number, left: null, right: null };
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length && i < level.length) {
    const node = queue.shift() as TreeNode;
    if (i < level.length) {
      const v = level[i++];
      if (v != null) {
        node.left = { val: v as number, left: null, right: null };
        queue.push(node.left);
      }
    }
    if (i < level.length) {
      const v = level[i++];
      if (v != null) {
        node.right = { val: v as number, left: null, right: null };
        queue.push(node.right);
      }
    }
  }
  return root;
}

export function serializeTree(root: unknown): (number | null)[] {
  const r = root as TreeNode | null;
  if (!r) return [];
  const out: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [r];
  let seen = 0;
  while (queue.length && seen < LIST_CAP) {
    const node = queue.shift() as TreeNode | null;
    seen++;
    if (node) {
      out.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      out.push(null);
    }
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

// --- singly linked list ---

export function buildList(vals: unknown, pos = -1): ListNode | null {
  if (!Array.isArray(vals) || vals.length === 0) return null;
  const nodes: ListNode[] = vals.map((v) => ({ val: v as number, next: null }));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && pos < nodes.length) nodes[nodes.length - 1].next = nodes[pos];
  return nodes[0];
}

export function serializeList(head: unknown): number[] {
  const out: number[] = [];
  const seen = new Set<unknown>();
  let cur = head as ListNode | null;
  while (cur && out.length < LIST_CAP) {
    if (seen.has(cur)) break; // defend against an unintended cycle
    seen.add(cur);
    out.push(cur.val);
    cur = cur.next;
  }
  return out;
}

// --- linked list with a random pointer: [[val, randomIndex|null], ...] ---

export function buildRandomList(arr: unknown): RandomListNode | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const nodes: RandomListNode[] = arr.map((pair) => ({
    val: (pair as [number, unknown])[0],
    next: null,
    random: null,
  }));
  for (let i = 0; i < nodes.length; i++) {
    if (i < nodes.length - 1) nodes[i].next = nodes[i + 1];
    const ri = (arr[i] as [number, number | null])[1];
    nodes[i].random = ri == null ? null : nodes[ri];
  }
  return nodes[0];
}

export function serializeRandomList(head: unknown): [number, number | null][] {
  const order: RandomListNode[] = [];
  const index = new Map<RandomListNode, number>();
  let cur = head as RandomListNode | null;
  while (cur && order.length < LIST_CAP) {
    if (index.has(cur)) break;
    index.set(cur, order.length);
    order.push(cur);
    cur = cur.next;
  }
  return order.map((n) => [n.val, n.random == null ? null : (index.get(n.random) ?? null)]);
}

// --- graph (clone-graph): 1-indexed adjacency array ---

export function buildGraph(adj: unknown): GraphNode | null {
  if (!Array.isArray(adj) || adj.length === 0) return null;
  const nodes: GraphNode[] = adj.map((_, i) => ({ val: i + 1, neighbors: [] }));
  for (let i = 0; i < adj.length; i++) {
    for (const nb of adj[i] as number[]) nodes[i].neighbors.push(nodes[nb - 1]);
  }
  return nodes[0];
}

export function serializeGraph(node: unknown): number[][] {
  const start = node as GraphNode | null;
  if (!start) return [];
  const visited = new Map<number, GraphNode>();
  const queue: GraphNode[] = [start];
  visited.set(start.val, start);
  while (queue.length) {
    const cur = queue.shift() as GraphNode;
    for (const nb of cur.neighbors) {
      if (!visited.has(nb.val)) {
        visited.set(nb.val, nb);
        queue.push(nb);
      }
    }
  }
  const vals = [...visited.keys()].sort((a, b) => a - b);
  return vals.map((v) =>
    (visited.get(v) as GraphNode).neighbors.map((nb) => nb.val).sort((a, b) => a - b),
  );
}

// --- dispatchers ---

export function deserializeArg(value: unknown, type: IoType): unknown {
  switch (type) {
    case "tree":
      return buildTree(value);
    case "linkedlist":
      return buildList(value);
    case "linkedlist-cycle": {
      const v = (value ?? {}) as { list?: unknown; pos?: number };
      return buildList(v.list, v.pos ?? -1);
    }
    case "linkedlist-random":
      return buildRandomList(value);
    case "graph-node":
      return buildGraph(value);
    default:
      return value;
  }
}

export function serializeReturn(value: unknown, type: IoType): unknown {
  switch (type) {
    case "tree":
      return serializeTree(value);
    case "linkedlist":
      return serializeList(value);
    case "linkedlist-random":
      return serializeRandomList(value);
    case "graph-node":
      return serializeGraph(value);
    default:
      return value;
  }
}

// --- call orchestration (used by the JS worker AND the Node verifier) ---

type AnyFn = (...args: unknown[]) => unknown;
type AnyClass = new (...args: unknown[]) => Record<string, AnyFn>;

export function callFunction(
  fn: AnyFn,
  rawArgs: unknown[],
  argTypes: IoType[] | undefined,
  returnType: IoType | undefined,
  mutatesArg: number | null | undefined,
): unknown {
  const callArgs = rawArgs.map((a, i) => deserializeArg(a, argTypes?.[i] ?? "plain"));
  const ret = fn(...callArgs);
  if (mutatesArg != null) {
    return serializeReturn(callArgs[mutatesArg], argTypes?.[mutatesArg] ?? "plain");
  }
  return serializeReturn(ret, returnType ?? "plain");
}

export function callDesign(
  Cls: AnyClass,
  operations: string[],
  argsList: unknown[][],
): unknown[] {
  const out: unknown[] = [];
  let inst: Record<string, AnyFn> | null = null;
  for (let i = 0; i < operations.length; i++) {
    const a = argsList[i] ?? [];
    if (i === 0) {
      inst = new Cls(...a);
      out.push(null);
    } else {
      const r = (inst as Record<string, AnyFn>)[operations[i]](...a);
      out.push(r === undefined ? null : r);
    }
  }
  return out;
}

// --- user-facing class definitions injected before user JS code ---
// Function-constructors keep the exact {val,left,right} / {val,next} /
// {val,neighbors} shapes the serializers read. Graph/random problems redefine
// `Node` from their own starter, which harmlessly overrides the graph default.

export const JS_PRELUDE = `
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
function Node(val, neighbors) {
  this.val = val === undefined ? 0 : val;
  this.neighbors = neighbors === undefined ? [] : neighbors;
}
`;
