import { create } from "zustand";

import type { Language } from "@/lib/workers/types";
import type { CaseResult } from "@/lib/workers/types";

export type RunPhase = "idle" | "starting-python" | "running" | "done";

interface SolveState {
  language: Language;
  /** Per-language working code, kept in memory while the view is open. */
  code: Record<Language, string>;
  phase: RunPhase;
  results: CaseResult[] | null;
  summary: { passed: number; total: number; runtimeMs: number } | null;
  /** True the instant every case in the last run passed (drives the all-pass moment). */
  allPassed: boolean;

  setLanguage: (lang: Language) => void;
  setCode: (lang: Language, code: string) => void;
  setPhase: (phase: RunPhase) => void;
  setResults: (
    results: CaseResult[],
    summary: { passed: number; total: number; runtimeMs: number },
  ) => void;
  reset: () => void;
}

export const useSolveStore = create<SolveState>((set) => ({
  language: "javascript",
  code: { javascript: "", python: "" },
  phase: "idle",
  results: null,
  summary: null,
  allPassed: false,

  setLanguage: (language) => set({ language }),
  setCode: (lang, code) =>
    set((s) => ({ code: { ...s.code, [lang]: code } })),
  setPhase: (phase) => set({ phase }),
  setResults: (results, summary) =>
    set({
      results,
      summary,
      phase: "done",
      allPassed: summary.total > 0 && summary.passed === summary.total,
    }),
  reset: () =>
    set({ phase: "idle", results: null, summary: null, allPassed: false }),
}));
