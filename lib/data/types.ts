// Exact TypeScript shapes for the static content JSON in /data.
// Content is the source of truth; these types describe that content only.

export interface Position {
  x: number;
  y: number;
}

// --- categories.json ---

export interface Category {
  id: string;
  name: string;
  order: number;
  blurb: string;
  default_io: string;
  prerequisites: string[];
  position: Position;
}

export interface GraphNode {
  id: string;
  label: string;
  position: Position;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface CategoriesFile {
  version: number;
  categories: Category[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}

// --- problems.json ---

export type Difficulty = "Easy" | "Medium" | "Hard";

export type IoKind =
  | "array"
  | "string"
  | "tree"
  | "linkedlist"
  | "graph"
  | "heap"
  | "design"
  | "matrix"
  | "bit";

export interface Problem {
  slug: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  order_in_category: number;
  global_order: number;
  leetcode_url: string;
  is_premium: boolean;
  io_kind: IoKind;
  playable: boolean;
}

export interface ProblemsFile {
  version: number;
  count: number;
  problems: Problem[];
}

// --- descriptions (one file per slug under data/descriptions/) ---
// Original, paraphrased problem statements — NEVER copied from LeetCode.

export interface DescriptionExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Description {
  slug: string;
  /** 2-4 sentence original summary of the task. Paragraphs split on blank lines. */
  summary: string;
  examples: DescriptionExample[];
  constraints: string[];
}

// --- challenges (one file per slug under data/challenges/) ---

export type Comparison = "exact" | "set" | "nested-unordered" | "float";

/**
 * How a single argument or a return value is encoded as JSON in a test case,
 * and how the harness must (de)serialize it around the user's function.
 * Everything crosses the worker boundary as plain JSON; structured node objects
 * exist only transiently inside the worker during the call.
 *  - plain            ints/strings/bools/arrays/matrices/bitmasks — used as-is.
 *  - tree             LeetCode level-order array (with nulls) <-> TreeNode.
 *  - linkedlist       value array                              <-> ListNode.
 *  - linkedlist-cycle { list: number[], pos: number }          -> cyclic ListNode (pos=-1: none).
 *  - linkedlist-random[[val, randomIndex|null], ...]           <-> ListNode w/ random pointer.
 *  - graph-node       1-indexed adjacency array                <-> clone-graph Node.
 */
export type IoType =
  | "plain"
  | "tree"
  | "linkedlist"
  | "linkedlist-cycle"
  | "linkedlist-random"
  | "graph-node";

export interface TestCase {
  args: unknown[];
  expected: unknown;
}

/** One operation-replay sequence for a stateful "design" problem. */
export interface DesignTestCase {
  /** operations[0] is the constructor and equals class_name; the rest are methods. */
  operations: string[];
  /** args[i] is spread into operations[i]. */
  args: unknown[][];
  /** expected[i] is the return of operations[i]; null for constructor & void methods. */
  expected: unknown[];
}

export interface StarterCode {
  python: string;
  javascript: string;
}

export interface Challenge {
  slug: string;
  /** "function" (default) calls one entry function; "design" replays a class API. */
  kind?: "function" | "design";
  entry_function: string;
  params: string[];
  /** Positional, parallel to a test case's args[]; defaults to all "plain". */
  arg_types?: IoType[];
  /** Encoding of the return value; defaults to "plain". */
  return_type?: IoType;
  /** Index of an in-place-mutated arg used AS the result (void-returning problems). */
  mutates_arg?: number | null;
  /** For kind:"design": the class the user must implement (operations[0]). */
  class_name?: string;
  comparison: Comparison;
  starter_code: StarterCode;
  test_cases: TestCase[] | DesignTestCase[];
}
