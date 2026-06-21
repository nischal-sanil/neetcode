// Python execution worker. Loads Pyodide from the CDN exactly once and keeps
// the interpreter warm across messages. Booting is slow (a few seconds), so a
// "warmup" message lets the UI show a one-time "starting Python" state.
//
// Structured I/O (trees, lists, graphs) and stateful "design" classes are
// handled by the embedded Python harness (lib/workers/py_harness.py), exec'd
// into the user namespace BEFORE the user code so a solution can reference
// TreeNode / ListNode / Node. Only plain JSON ever crosses the boundary.
//
// This file only ever runs inside a Web Worker — Pyodide is never imported at
// module top level in a way that executes during SSR.
//
// It NEVER returns or exposes any reference solution — only inputs and expected
// outputs are provided.

import { compare } from "./compare";
import { PY_HARNESS } from "./py-harness.generated";
import type { CaseResult, WorkerInput, WorkerMessage, WorkerOutput } from "./types";

// Pinned Pyodide version. Keep the loader URL and the indexURL on the same tag.
const PYODIDE_VERSION = "0.27.2";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// Minimal shape of the Pyodide API we use.
interface PyProxy {
  toJs(opts?: { dict_converter?: (entries: Iterable<[unknown, unknown]>) => unknown }): unknown;
  destroy(): void;
  [Symbol.iterator]?: unknown;
}
interface PyNamespace {
  get(name: string): unknown;
  set(name: string, value: unknown): void;
  destroy(): void;
}
interface PyodideAPI {
  runPython(code: string, opts?: { globals?: PyNamespace }): unknown;
  globals: { get(name: string): (() => PyNamespace) };
  toPy(value: unknown): unknown;
}

declare function importScripts(...urls: string[]): void;
declare const loadPyodide: (config: { indexURL: string }) => Promise<PyodideAPI>;

let pyodidePromise: Promise<PyodideAPI> | null = null;

function getPyodide(): Promise<PyodideAPI> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      importScripts(PYODIDE_BASE + "pyodide.js");
      return await loadPyodide({ indexURL: PYODIDE_BASE });
    })();
  }
  return pyodidePromise;
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) {
    // Pyodide surfaces Python tracebacks in the message; trim to the last line.
    const lines = e.message.trim().split("\n");
    return lines[lines.length - 1] || e.message;
  }
  return String(e);
}

/** Recursively convert a Pyodide return value into plain JSON-able JS. */
function toPlainJs(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "object" && value !== null && "toJs" in (value as object)) {
    const proxy = value as PyProxy;
    const js = proxy.toJs({
      // Convert Python dicts to plain objects (Maps aren't JSON-able for our compare).
      dict_converter: (entries) => Object.fromEntries(entries as Iterable<[string, unknown]>),
    });
    proxy.destroy();
    return toPlainJs(js);
  }
  if (value instanceof Map) {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of value) obj[String(k)] = toPlainJs(v);
    return obj;
  }
  if (Array.isArray(value)) return value.map(toPlainJs);
  return value;
}

function destroyProxy(p: unknown): void {
  if (p && typeof (p as PyProxy).destroy === "function") {
    try {
      (p as PyProxy).destroy();
    } catch {
      /* already destroyed */
    }
  }
}

// Driver: __raw__ (this case's args) + __ops__ (design op names) + __cfg__
// (constant config dict) are set from JS; produces __result__.
const DRIVER = `
if __cfg__['kind'] == 'design':
    __result__ = _run_design(__cfg__['class_name'], __ops__, __raw__)
else:
    __result__ = _run_function(__cfg__['entry'], __raw__, __cfg__['arg_types'], __cfg__['return_type'], __cfg__['mutates'])
`;

async function run(input: WorkerInput): Promise<WorkerOutput> {
  const { code, entryFunction, testCases, comparison, mode, className } = input;
  const pyodide = await getPyodide();
  const start = performance.now();
  const results: CaseResult[] = [];
  const isDesign = mode === "design";
  const requiredName = isDesign ? className ?? "" : entryFunction;

  // exec the harness, then the user code, into an isolated namespace; then
  // verify the required entry / class is defined.
  let ns: PyNamespace | null = null;
  let cfgProxy: unknown = null;
  let buildError: string | null = null;
  try {
    ns = (pyodide.globals.get("dict") as () => PyNamespace)();
    pyodide.runPython(PY_HARNESS, { globals: ns });
    pyodide.runPython(code, { globals: ns });
    const exists = pyodide.runPython(
      `'${requiredName}' in dir() or '${requiredName}' in globals()`,
      { globals: ns },
    );
    if (!exists) {
      buildError = `${isDesign ? "Class" : "Function"} "${requiredName}" is not defined.`;
    } else {
      cfgProxy = pyodide.toPy({
        kind: isDesign ? "design" : "function",
        entry: entryFunction,
        class_name: className ?? null,
        arg_types: input.argTypes ?? null,
        return_type: input.returnType ?? null,
        mutates: input.mutatesArg ?? null,
      });
      ns.set("__cfg__", cfgProxy);
    }
  } catch (e) {
    buildError = errorMessage(e);
  }

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    if (buildError || !ns) {
      results.push({ index: i, passed: false, expected: tc.expected, error: buildError ?? "Build error" });
      continue;
    }
    let rawProxy: unknown = null;
    let opsProxy: unknown = null;
    try {
      rawProxy = pyodide.toPy(tc.args);
      ns.set("__raw__", rawProxy);
      opsProxy = pyodide.toPy(isDesign ? tc.operations ?? [] : []);
      ns.set("__ops__", opsProxy);
      pyodide.runPython(DRIVER, { globals: ns });
      const got = toPlainJs(ns.get("__result__"));
      const passed = compare(got, tc.expected, comparison);
      results.push({ index: i, passed, got, expected: tc.expected });
    } catch (e) {
      results.push({ index: i, passed: false, expected: tc.expected, error: errorMessage(e) });
    } finally {
      destroyProxy(rawProxy);
      destroyProxy(opsProxy);
    }
  }

  destroyProxy(cfgProxy);
  if (ns) ns.destroy();

  return {
    results,
    summary: {
      passed: results.filter((r) => r.passed).length,
      total: testCases.length,
      runtimeMs: Math.round(performance.now() - start),
    },
  };
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data;
  const post = (data: unknown) => (self as unknown as Worker).postMessage(data);

  if (msg.kind === "warmup") {
    try {
      await getPyodide();
      post({ kind: "ready" });
    } catch (err) {
      post({ kind: "ready", error: errorMessage(err) });
    }
    return;
  }

  // kind === "run"
  const output = await run(msg);
  post(output);
};
