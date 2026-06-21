// Shared types for the code-execution workers and the client that drives them.
// See CLAUDE.md "Code-execution contract".

export type Comparison = "exact" | "set" | "nested-unordered" | "float";

export type Language = "javascript" | "python";

export type IoType =
  | "plain"
  | "tree"
  | "linkedlist"
  | "linkedlist-cycle"
  | "linkedlist-random"
  | "graph-node";

/**
 * A test case is either a function case ({args, expected}) or a design
 * operation-replay case ({operations, args, expected}). Both carry `args` and
 * `expected`, so the result display renders either without special-casing.
 */
export interface TestCase {
  args: unknown[];
  expected: unknown;
  /** Present only for kind:"design" cases. */
  operations?: string[];
}

export interface WorkerInput {
  code: string;
  entryFunction: string;
  testCases: TestCase[];
  comparison: Comparison;
  /** Execution shape; defaults to "function". (Named `mode` to avoid clashing
   *  with the run/warmup message envelope's `kind`.) */
  mode?: "function" | "design";
  /** Positional arg encodings; defaults to all "plain". */
  argTypes?: IoType[];
  /** Return-value encoding; defaults to "plain". */
  returnType?: IoType;
  /** Index of an in-place-mutated arg used as the result. */
  mutatesArg?: number | null;
  /** For kind:"design": the class to instantiate. */
  className?: string;
}

export interface CaseResult {
  index: number;
  passed: boolean;
  got?: unknown;
  expected: unknown;
  error?: string;
}

export interface WorkerOutput {
  results: CaseResult[];
  summary: {
    passed: number;
    total: number;
    runtimeMs: number;
  };
}

// Python worker also accepts a warmup message to pre-boot Pyodide.
export type WorkerMessage =
  | ({ kind: "run" } & WorkerInput)
  | { kind: "warmup" };

export type PythonReadyMessage = { kind: "ready" };
