"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  Circle,
  CircleDot,
  Lock,
  Play,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { toggleStar } from "@/lib/actions/progress";
import type { Difficulty, Problem } from "@/lib/data/types";
import type { ProgressMap } from "@/lib/db/queries";

const difficultyClass: Record<Difficulty, string> = {
  Easy: "text-difficulty-easy",
  Medium: "text-difficulty-medium",
  Hard: "text-difficulty-hard",
};

const difficultyDot: Record<Difficulty, string> = {
  Easy: "bg-difficulty-easy",
  Medium: "bg-difficulty-medium",
  Hard: "bg-difficulty-hard",
};

type Status = "not_started" | "attempted" | "solved";

function StatusIcon({ status }: { status: Status }) {
  if (status === "solved") {
    return (
      <span
        className="grid size-5 place-items-center rounded-full bg-primary/15 text-primary glow-accent"
        title="Solved"
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (status === "attempted") {
    return (
      <span
        className="grid size-5 place-items-center text-difficulty-medium"
        title="Attempted"
      >
        <CircleDot className="size-4" />
      </span>
    );
  }
  return (
    <span
      className="grid size-5 place-items-center text-muted-foreground/40"
      title="Not started"
    >
      <Circle className="size-4" />
    </span>
  );
}

function StarButton({
  slug,
  starred,
  onToggle,
}: {
  slug: string;
  starred: boolean;
  onToggle: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      aria-label={starred ? "Unstar problem" : "Star problem"}
      aria-pressed={starred}
      onClick={() => onToggle(slug)}
      className={cn(
        "pointer-events-auto relative z-10 grid size-7 shrink-0 place-items-center rounded-md transition-colors hover:bg-surface-raised",
        starred ? "text-primary" : "text-muted-foreground/50 hover:text-foreground",
      )}
    >
      <Star className="size-4" fill={starred ? "currentColor" : "none"} />
    </button>
  );
}

export function ProblemList({
  problems,
  progressMap,
}: {
  problems: Problem[];
  progressMap: ProgressMap;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Optimistic star overrides keyed by slug; falls back to the server map.
  const [starOverrides, setStarOverrides] = useState<Record<string, boolean>>(
    {},
  );

  function handleToggle(slug: string) {
    const current = starOverrides[slug] ?? progressMap[slug]?.starred ?? false;
    const next = !current;
    setStarOverrides((prev) => ({ ...prev, [slug]: next }));

    startTransition(async () => {
      try {
        const confirmed = await toggleStar(slug);
        setStarOverrides((prev) => ({ ...prev, [slug]: confirmed }));
        router.refresh();
      } catch {
        // Roll back the optimistic flip.
        setStarOverrides((prev) => ({ ...prev, [slug]: current }));
        toast.error("Couldn't update star. Try again.");
      }
    });
  }

  return (
    <ul className="panel divide-y divide-edge overflow-hidden p-0">
      {problems.map((p) => {
        const entry = progressMap[p.slug];
        const status = (entry?.status ?? "not_started") as Status;
        const starred = starOverrides[p.slug] ?? entry?.starred ?? false;

        return (
          <li key={p.slug} className="group/row relative">
            {/* Full-row overlay link — keeps navigation frictionless while the
                star button stays separately clickable above it (z-10). */}
            <Link
              href={`/problem/${p.slug}`}
              aria-label={p.title}
              className="absolute inset-0 z-0 rounded-md focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            />
            <div className="pointer-events-none relative flex items-center gap-3 px-3 py-2.5 transition-colors group-hover/row:bg-surface-raised">
              <StatusIcon status={status} />

              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  difficultyDot[p.difficulty],
                )}
                aria-hidden
              />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-sm font-medium",
                  status === "solved"
                    ? "text-muted-foreground"
                    : "text-foreground",
                )}
              >
                {p.title}
              </span>

              <span
                className={cn(
                  "shrink-0 text-[0.6875rem] font-semibold uppercase tracking-wide",
                  difficultyClass[p.difficulty],
                )}
              >
                {p.difficulty}
              </span>

              {p.is_premium && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-edge bg-surface-raised px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
                  <Lock className="size-2.5" />
                  Premium
                </span>
              )}

              {p.playable ? (
                <span
                  className="hidden shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[0.625rem] font-semibold text-primary sm:inline-flex"
                  title="Solve in-app against test cases"
                >
                  <Play className="size-2.5" fill="currentColor" />
                  Solve
                </span>
              ) : (
                <span
                  className="hidden shrink-0 text-[0.625rem] font-medium text-muted-foreground/60 sm:inline"
                  title="No in-app tests for this problem yet"
                >
                  Link only
                </span>
              )}

              <StarButton
                slug={p.slug}
                starred={starred}
                onToggle={handleToggle}
              />

              <ChevronRight className="size-4 shrink-0 text-muted-foreground/30 transition-colors group-hover/row:text-muted-foreground" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
