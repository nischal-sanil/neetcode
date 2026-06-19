// Shared types for the code-execution workers and the client that drives them.
// See CLAUDE.md "Code-execution contract".

export type Comparison = "exact" | "set" | "nested-unordered";

export type Language = "javascript" | "python";

export interface TestCase {
  args: unknown[];
  expected: unknown;
}

export interface WorkerInput {
  code: string;
  entryFunction: string;
  testCases: TestCase[];
  comparison: Comparison;
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
