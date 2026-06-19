// JavaScript execution worker. Runs entirely off the main thread.
// Builds the user's entry function from arbitrary code, runs each test case
// against a deep-copied set of args, and reports per-case results.
//
// It NEVER returns or exposes any reference solution — there is none; only
// inputs and expected outputs are provided.

import { compare, deepCopy } from "./compare";
import type { CaseResult, WorkerInput, WorkerOutput } from "./types";

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.name + ": " + e.message;
  return String(e);
}

function run(input: WorkerInput): WorkerOutput {
  const { code, entryFunction, testCases, comparison } = input;
  const start = performance.now();
  const results: CaseResult[] = [];

  // Build the user's function. If the code itself doesn't compile or the
  // entry function isn't defined, every case fails with that error.
  let fn: ((...args: unknown[]) => unknown) | null = null;
  let buildError: string | null = null;
  try {
    // eslint-disable-next-line no-new-func
    const factory = new Function(code + "\n; return " + entryFunction + ";");
    const candidate = factory();
    if (typeof candidate !== "function") {
      buildError = `Function "${entryFunction}" is not defined.`;
    } else {
      fn = candidate as (...args: unknown[]) => unknown;
    }
  } catch (e) {
    buildError = errorMessage(e);
  }

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    if (!fn) {
      results.push({ index: i, passed: false, expected: tc.expected, error: buildError ?? "Build error" });
      continue;
    }
    try {
      const args = deepCopy(tc.args);
      const got = fn(...args);
      const passed = compare(got, tc.expected, comparison);
      results.push({ index: i, passed, got, expected: tc.expected });
    } catch (e) {
      results.push({ index: i, passed: false, expected: tc.expected, error: errorMessage(e) });
    }
  }

  const runtimeMs = Math.round(performance.now() - start);
  return {
    results,
    summary: {
      passed: results.filter((r) => r.passed).length,
      total: testCases.length,
      runtimeMs,
    },
  };
}

self.onmessage = (e: MessageEvent<WorkerInput>) => {
  const output = run(e.data);
  (self as unknown as Worker).postMessage(output);
};
