"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CaseResult } from "@/lib/workers/types";
import { useSolveStore } from "./store";
import { formatArgs, formatValue } from "./format";

interface TestPanelProps {
  /** The raw test cases, used to show input args per case. */
  testCases: { args: unknown[]; expected: unknown }[];
}

export function TestPanel({ testCases }: TestPanelProps) {
  const phase = useSolveStore((s) => s.phase);
  const results = useSolveStore((s) => s.results);
  const summary = useSolveStore((s) => s.summary);
  const allPassed = useSolveStore((s) => s.allPassed);

  if (phase === "starting-python") {
    return (
      <Centered>
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>Starting Python…</span>
        <span className="text-xs text-muted-foreground">
          Booting the interpreter once — this is faster next time.
        </span>
      </Centered>
    );
  }

  if (phase === "running") {
    return (
      <Centered>
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>Running {testCases.length} test cases…</span>
      </Centered>
    );
  }

  if (!results || !summary) {
    return (
      <Centered>
        <span className="text-muted-foreground">
          Run your solution to see results.
        </span>
        <span className="text-xs text-muted-foreground">
          {testCases.length} test {testCases.length === 1 ? "case" : "cases"} ·
          press{" "}
          <kbd className="rounded border border-edge bg-surface-raised px-1 py-px font-mono text-[0.7rem]">
            ⌘⏎
          </kbd>{" "}
          to run
        </span>
      </Centered>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Summary
        passed={summary.passed}
        total={summary.total}
        runtimeMs={summary.runtimeMs}
        allPassed={allPassed}
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <ul className="flex flex-col gap-2">
          {results.map((r) => (
            <CaseRow
              key={r.index}
              result={r}
              args={testCases[r.index]?.args ?? []}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function Summary({
  passed,
  total,
  runtimeMs,
  allPassed,
}: {
  passed: number;
  total: number;
  runtimeMs: number;
  allPassed: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-edge px-4 py-3">
      <div className="flex items-baseline gap-2">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`${passed}/${total}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className={cn(
              "font-display text-lg font-semibold tabular-nums",
              allPassed ? "text-difficulty-easy" : "text-foreground",
            )}
          >
            {passed}/{total}
          </motion.span>
        </AnimatePresence>
        <span className="text-sm text-muted-foreground">passed</span>
        {allPassed && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="ml-1 inline-flex items-center gap-1 rounded-full bg-difficulty-easy/15 px-2 py-0.5 text-xs font-medium text-difficulty-easy"
          >
            <Check className="size-3" /> Solved
          </motion.span>
        )}
      </div>
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        {runtimeMs} ms
      </span>
    </div>
  );
}

function CaseRow({ result, args }: { result: CaseResult; args: unknown[] }) {
  const { passed, index, got, expected, error } = result;
  return (
    <motion.li
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.2) }}
      className={cn(
        "rounded-lg border px-3 py-2.5",
        passed
          ? "border-difficulty-easy/25 bg-difficulty-easy/[0.04]"
          : "border-difficulty-hard/30 bg-difficulty-hard/[0.05]",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid size-4 shrink-0 place-items-center rounded-full",
            passed
              ? "bg-difficulty-easy/20 text-difficulty-easy"
              : "bg-difficulty-hard/20 text-difficulty-hard",
          )}
        >
          {passed ? <Check className="size-3" /> : <X className="size-3" />}
        </span>
        <span className="text-sm font-medium">Case {index + 1}</span>
        <span
          className={cn(
            "ml-auto text-xs font-medium",
            passed ? "text-difficulty-easy" : "text-difficulty-hard",
          )}
        >
          {passed ? "PASS" : error ? "ERROR" : "FAIL"}
        </span>
      </div>

      {!passed && (
        <div className="mt-2 flex flex-col gap-1.5 font-mono text-xs">
          <Field label="input" value={formatArgs(args)} />
          {error ? (
            <Field label="error" value={error} tone="hard" />
          ) : (
            <>
              <Field label="got" value={formatValue(got)} tone="hard" />
              <Field
                label="expected"
                value={formatValue(expected)}
                tone="easy"
              />
            </>
          )}
        </div>
      )}
    </motion.li>
  );
}

function Field({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "hard" | "easy";
}) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-2">
      <span className="select-none pt-px text-right text-muted-foreground">
        {label}
      </span>
      <pre
        className={cn(
          "overflow-x-auto whitespace-pre-wrap break-words text-foreground/90",
          tone === "hard" && "text-difficulty-hard",
          tone === "easy" && "text-difficulty-easy",
        )}
      >
        {value}
      </pre>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm">
      {children}
    </div>
  );
}
