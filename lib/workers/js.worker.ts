// JavaScript execution worker. Runs entirely off the main thread.
// Builds the user's entry function (or design class) from arbitrary code, runs
// each test case against deep-copied args — deserializing structured inputs
// (trees, lists, graphs) and serializing structured outputs around the call —
// and reports per-case results.
//
// It NEVER returns or exposes any reference solution — there is none; only
// inputs and expected outputs are provided.

import { compare, deepCopy } from "./compare";
import { JS_PRELUDE, callDesign, callFunction } from "./serde";
import type { CaseResult, WorkerInput, WorkerOutput } from "./types";

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.name + ": " + e.message;
  return String(e);
}

type AnyFn = (...args: unknown[]) => unknown;
type AnyClass = new (...args: unknown[]) => Record<string, AnyFn>;

function summarize(results: CaseResult[], total: number, start: number): WorkerOutput {
  return {
    results,
    summary: {
      passed: results.filter((r) => r.passed).length,
      total,
      runtimeMs: Math.round(performance.now() - start),
    },
  };
}

function runDesign(input: WorkerInput, start: number): WorkerOutput {
  const { code, className, testCases, comparison } = input;
  const results: CaseResult[] = [];

  let Cls: AnyClass | null = null;
  let buildError: string | null = null;
  try {
    const factory = new Function(JS_PRELUDE + "\n" + code + "\n; return " + className + ";");
    const candidate = factory();
    if (typeof candidate !== "function") {
      buildError = `Class "${className}" is not defined.`;
    } else {
      Cls = candidate as AnyClass;
    }
  } catch (e) {
    buildError = errorMessage(e);
  }

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    if (!Cls) {
      results.push({ index: i, passed: false, expected: tc.expected, error: buildError ?? "Build error" });
      continue;
    }
    try {
      const got = callDesign(Cls, tc.operations ?? [], deepCopy(tc.args) as unknown[][]);
      results.push({ index: i, passed: compare(got, tc.expected, comparison), got, expected: tc.expected });
    } catch (e) {
      results.push({ index: i, passed: false, expected: tc.expected, error: errorMessage(e) });
    }
  }

  return summarize(results, testCases.length, start);
}

function run(input: WorkerInput): WorkerOutput {
  const start = performance.now();
  if (input.mode === "design") return runDesign(input, start);

  const { code, entryFunction, testCases, comparison, argTypes, returnType, mutatesArg } = input;
  const results: CaseResult[] = [];

  // Build the user's function. If the code itself doesn't compile or the
  // entry function isn't defined, every case fails with that error.
  let fn: AnyFn | null = null;
  let buildError: string | null = null;
  try {
    const factory = new Function(JS_PRELUDE + "\n" + code + "\n; return " + entryFunction + ";");
    const candidate = factory();
    if (typeof candidate !== "function") {
      buildError = `Function "${entryFunction}" is not defined.`;
    } else {
      fn = candidate as AnyFn;
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
      const got = callFunction(fn, deepCopy(tc.args), argTypes, returnType, mutatesArg);
      const passed = compare(got, tc.expected, comparison);
      results.push({ index: i, passed, got, expected: tc.expected });
    } catch (e) {
      results.push({ index: i, passed: false, expected: tc.expected, error: errorMessage(e) });
    }
  }

  return summarize(results, testCases.length, start);
}

self.onmessage = (e: MessageEvent<WorkerInput>) => {
  const output = run(e.data);
  (self as unknown as Worker).postMessage(output);
};
