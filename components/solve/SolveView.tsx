"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";

import type { Challenge, Difficulty } from "@/lib/data/types";
import { runTests, warmPython, disposePython } from "@/lib/workers/client";
import { recordRun } from "@/lib/actions/progress";
import type { Language } from "@/lib/workers/types";
import { cn } from "@/lib/utils";

import { ContextPane } from "./ContextPane";
import { CodeEditor } from "./CodeEditor";
import { TestPanel } from "./TestPanel";
import { useSolveStore } from "./store";

export interface SolveViewProps {
  slug: string;
  title: string;
  difficulty: Difficulty;
  categoryId: string;
  categoryName: string;
  leetcodeUrl: string;
  isPremium: boolean;
  initialStarred: boolean;
  status: string;
  challenge: Challenge;
  /** Server-restored drafts (null => fall back to starter_code). */
  drafts: { python: string | null; javascript: string | null };
}

const LANGS: { id: Language; label: string }[] = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
];

export function SolveView(props: SolveViewProps) {
  const { slug, challenge, drafts } = props;

  const language = useSolveStore((s) => s.language);
  const codeMap = useSolveStore((s) => s.code);
  const phase = useSolveStore((s) => s.phase);
  const setLanguage = useSolveStore((s) => s.setLanguage);
  const setCode = useSolveStore((s) => s.setCode);
  const setPhase = useSolveStore((s) => s.setPhase);
  const setResults = useSolveStore((s) => s.setResults);
  const reset = useSolveStore((s) => s.reset);

  // Seed both languages from draft-or-starter exactly once when this view
  // mounts. The store is module-global across navigations, so reset it here
  // (useState initializer runs before paint, no render-phase warning).
  useState(() => {
    useSolveStore.setState({
      language: "javascript",
      code: {
        javascript: drafts.javascript ?? challenge.starter_code.javascript,
        python: drafts.python ?? challenge.starter_code.python,
      },
      phase: "idle",
      results: null,
      summary: null,
      allPassed: false,
    });
    return null;
  });

  // Tear the Python worker down when leaving the solve view.
  useEffect(() => () => disposePython(), []);

  const code = codeMap[language];
  const running = phase === "running" || phase === "starting-python";

  const onRun = useCallback(async () => {
    const state = useSolveStore.getState();
    const lang = state.language;
    const source = state.code[lang];

    if (lang === "python") {
      setPhase("starting-python");
      await warmPython();
    }
    setPhase("running");

    const out = await runTests(lang, {
      code: source,
      entryFunction: challenge.entry_function,
      testCases: challenge.test_cases,
      comparison: challenge.comparison,
      mode: challenge.kind === "design" ? "design" : "function",
      argTypes: challenge.arg_types,
      returnType: challenge.return_type,
      mutatesArg: challenge.mutates_arg,
      className: challenge.class_name,
    });

    setResults(out.results, out.summary);

    const passedAll =
      out.summary.total > 0 && out.summary.passed === out.summary.total;

    // The ONLY status-transition path — recordRun stamps attempted/solved.
    await recordRun({
      slug,
      language: lang,
      passed: passedAll,
      passedCases: out.summary.passed,
      totalCases: out.summary.total,
      runtimeMs: out.summary.runtimeMs,
    });

    if (passedAll) {
      toast.success("All tests passed — solved!", {
        description: `${out.summary.total}/${out.summary.total} cases · ${out.summary.runtimeMs} ms`,
      });
    } else if (out.summary.passed > 0) {
      toast(`${out.summary.passed}/${out.summary.total} cases passed`);
    } else {
      toast.error("No cases passed yet");
    }
  }, [challenge, slug, setPhase, setResults]);

  // Warm Python the moment the user selects it, so the first run is quicker.
  const onSwitchLanguage = (lang: Language) => {
    if (lang === language) return;
    reset();
    setLanguage(lang);
    if (lang === "python") void warmPython();
  };

  // Global Cmd/Ctrl+Enter (in addition to the in-editor binding).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!running) void onRun();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onRun, running]);

  return (
    <div className="grid h-[calc(100dvh-3.5rem)] grid-cols-1 gap-4 p-4 lg:grid-cols-[minmax(280px,360px)_1fr]">
      <ContextPane
        slug={slug}
        title={props.title}
        difficulty={props.difficulty}
        categoryId={props.categoryId}
        categoryName={props.categoryName}
        leetcodeUrl={props.leetcodeUrl}
        isPremium={props.isPremium}
        initialStarred={props.initialStarred}
        status={props.status}
        challenge={challenge}
      />

      <div className="panel flex min-h-0 flex-col overflow-hidden">
        {/* Toolbar: language toggle + run */}
        <div className="flex items-center justify-between gap-2 border-b border-edge px-3 py-2">
          <div className="flex items-center gap-1 rounded-lg bg-surface-raised p-0.5">
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => onSwitchLanguage(l.id)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                  language === l.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          <motion.button
            type="button"
            onClick={() => void onRun()}
            disabled={running}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-60",
            )}
          >
            {running ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5 fill-current" />
            )}
            {phase === "starting-python" ? "Starting Python…" : "Run"}
            <kbd className="ml-1 hidden rounded bg-black/20 px-1 font-mono text-[0.65rem] sm:inline">
              ⌘⏎
            </kbd>
          </motion.button>
        </div>

        {/* Editor + tests split */}
        <div className="grid min-h-0 flex-1 grid-rows-[1fr_minmax(180px,38%)]">
          <div className="min-h-0 border-b border-edge">
            <CodeEditor
              slug={slug}
              language={language}
              value={code}
              onChange={(c) => setCode(language, c)}
              onRun={() => void onRun()}
            />
          </div>
          <div className="min-h-0">
            <TestPanel testCases={challenge.test_cases} />
          </div>
        </div>
      </div>
    </div>
  );
}
