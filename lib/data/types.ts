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

// --- challenges.json ---

export type Comparison = "exact" | "set" | "nested-unordered";

export interface TestCase {
  args: unknown[];
  expected: unknown;
}

export interface StarterCode {
  python: string;
  javascript: string;
}

export interface Challenge {
  slug: string;
  entry_function: string;
  params: string[];
  comparison: Comparison;
  starter_code: StarterCode;
  test_cases: TestCase[];
}

export interface ChallengesFile {
  version: number;
  challenges: Challenge[];
}
