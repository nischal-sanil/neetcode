import Link from "next/link";
import { ArrowLeft, ExternalLink, Lock } from "lucide-react";

import type { Challenge, Description, Difficulty } from "@/lib/data/types";
import { DifficultyBadge } from "./DifficultyBadge";
import { StarButton } from "./StarButton";

interface ContextPaneProps {
  title: string;
  difficulty: Difficulty;
  categoryId: string;
  categoryName: string;
  leetcodeUrl: string;
  isPremium: boolean;
  initialStarred: boolean;
  slug: string;
  status: string;
  challenge: Challenge | null;
  description?: Description | null;
}

const statusLabel: Record<string, string> = {
  solved: "Solved",
  attempted: "Attempted",
  not_started: "Not started",
};

export function ContextPane({
  title,
  difficulty,
  categoryId,
  categoryName,
  leetcodeUrl,
  isPremium,
  initialStarred,
  slug,
  status,
  challenge,
  description,
}: ContextPaneProps) {
  return (
    <aside className="panel flex h-full flex-col overflow-y-auto p-5">
      <Link
        href={`/topic/${categoryId}`}
        className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {categoryName}
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <h1 className="font-display text-2xl leading-tight font-semibold tracking-tight text-balance">
          {title}
        </h1>
        <StarButton slug={slug} initialStarred={initialStarred} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={difficulty} />
        <span className="text-xs text-muted-foreground">
          {statusLabel[status] ?? "Not started"}
        </span>
        {isPremium && (
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            <Lock className="size-3" />
            LeetCode Premium
          </span>
        )}
      </div>

      {description && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="text-sm leading-relaxed text-foreground/90">
            {description.summary.split(/\n\n+/).map((para, i) => (
              <p key={i} className={i > 0 ? "mt-2.5" : undefined}>
                {para}
              </p>
            ))}
          </div>

          {description.examples.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {description.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-edge bg-surface-raised p-3 text-xs"
                >
                  <p className="font-medium text-muted-foreground">
                    Example {i + 1}
                  </p>
                  <div className="mt-1.5 flex flex-col gap-1">
                    <div className="font-mono break-words">
                      <span className="text-muted-foreground">Input: </span>
                      {ex.input}
                    </div>
                    <div className="font-mono break-words">
                      <span className="text-muted-foreground">Output: </span>
                      {ex.output}
                    </div>
                    {ex.explanation && (
                      <p className="mt-0.5 text-muted-foreground">{ex.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {description.constraints.length > 0 && (
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Constraints
              </p>
              <ul className="mt-2 flex flex-col gap-1 text-xs text-foreground/80">
                {description.constraints.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="font-mono break-words">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {challenge && (
        <div className="mt-6">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Your task
          </p>
          <p className="mt-2 text-sm text-foreground/90">
            Write{" "}
            <code className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-[0.8rem] text-primary">
              {challenge.entry_function}({challenge.params.join(", ")})
            </code>{" "}
            so every test case passes.
          </p>
        </div>
      )}

      <div className="mt-auto pt-6">
        <a
          href={leetcodeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-edge bg-surface-raised px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
        >
          Open on LeetCode
          <ExternalLink className="size-3.5" />
        </a>
        {isPremium && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            This problem is LeetCode Premium — the link may be paywalled.
          </p>
        )}
      </div>
    </aside>
  );
}
