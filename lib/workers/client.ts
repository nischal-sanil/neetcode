// Browser-side helper — the ONLY place the main thread talks to the workers.
// Spawns the correct worker, enforces a ~5s timeout (by terminating the worker
// and filling unfinished cases with a timeout error), and resolves a WorkerOutput.
//
// Also exposes warmPython() to pre-boot the Python worker and keep it warm, plus
// disposers so the solve view can tear workers down on unmount.

import type { Language, WorkerInput, WorkerOutput } from "./types";

const TIMEOUT_MS = 5000;

function spawn(language: Language): Worker {
  if (language === "python") {
    return new Worker(new URL("./python.worker.ts", import.meta.url), { type: "module" });
  }
  return new Worker(new URL("./js.worker.ts", import.meta.url), { type: "module" });
}

function timeoutOutput(input: WorkerInput, runtimeMs: number): WorkerOutput {
  const results = input.testCases.map((tc, index) => ({
    index,
    passed: false,
    expected: tc.expected,
    error: `Timed out after ${TIMEOUT_MS} ms`,
  }));
  return { results, summary: { passed: 0, total: input.testCases.length, runtimeMs } };
}

/**
 * Run the test cases for one submission.
 * For Python a fresh-but-warm worker is reused; for JS a throwaway worker is
 * spawned per run (JS workers are cheap and this guarantees a clean global).
 */
export function runTests(language: Language, input: WorkerInput): Promise<WorkerOutput> {
  if (language === "python") return runPython(input);
  return runJs(input);
}

function runJs(input: WorkerInput): Promise<WorkerOutput> {
  return new Promise((resolve) => {
    const worker = spawn("javascript");
    const start = performance.now();
    let settled = false;

    const finish = (out: WorkerOutput) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      resolve(out);
    };

    const timer = setTimeout(
      () => finish(timeoutOutput(input, Math.round(performance.now() - start))),
      TIMEOUT_MS,
    );

    worker.onmessage = (e: MessageEvent<WorkerOutput>) => finish(e.data);
    worker.onerror = () => {
      const runtimeMs = Math.round(performance.now() - start);
      const results = input.testCases.map((tc, index) => ({
        index,
        passed: false,
        expected: tc.expected,
        error: "Worker crashed",
      }));
      finish({ results, summary: { passed: 0, total: input.testCases.length, runtimeMs } });
    };

    worker.postMessage(input);
  });
}

// ---- Python worker: kept warm across runs -------------------------------

let pyWorker: Worker | null = null;
let pyReady: Promise<void> | null = null;

function ensurePyWorker(): Worker {
  if (!pyWorker) pyWorker = spawn("python");
  return pyWorker;
}

/** Pre-boot Pyodide and keep the worker alive. Safe to call repeatedly. */
export function warmPython(): Promise<void> {
  if (pyReady) return pyReady;
  const worker = ensurePyWorker();
  pyReady = new Promise<void>((resolve) => {
    const onReady = (e: MessageEvent) => {
      if (e.data && e.data.kind === "ready") {
        worker.removeEventListener("message", onReady);
        resolve();
      }
    };
    worker.addEventListener("message", onReady);
    worker.postMessage({ kind: "warmup" });
  });
  return pyReady;
}

function runPython(input: WorkerInput): Promise<WorkerOutput> {
  return new Promise((resolve) => {
    const worker = ensurePyWorker();
    const start = performance.now();
    let settled = false;

    const cleanup = () => {
      worker.removeEventListener("message", onMessage);
      clearTimeout(timer);
    };

    const finish = (out: WorkerOutput) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(out);
    };

    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      // Ignore stray "ready" messages from a concurrent warmup.
      if (data && data.kind === "ready") return;
      finish(data as WorkerOutput);
    };

    // On timeout the interpreter may be stuck (e.g. infinite loop), so we must
    // terminate and rebuild the warm Python worker — Pyodide will re-boot.
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      disposePython();
      resolve(timeoutOutput(input, Math.round(performance.now() - start)));
    }, TIMEOUT_MS);

    worker.addEventListener("message", onMessage);
    worker.postMessage({ kind: "run", ...input });
  });
}

/** Terminate the Python worker (next runTests/warmPython re-boots it). */
export function disposePython(): void {
  if (pyWorker) {
    pyWorker.terminate();
    pyWorker = null;
  }
  pyReady = null;
}
