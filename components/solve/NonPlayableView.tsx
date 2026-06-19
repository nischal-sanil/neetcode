import { ExternalLink, FlaskConical } from "lucide-react";

import type { Difficulty } from "@/lib/data/types";
import { ContextPane } from "./ContextPane";

export interface NonPlayableViewProps {
  slug: string;
  title: string;
  difficulty: Difficulty;
  categoryId: string;
  categoryName: string;
  leetcodeUrl: string;
  isPremium: boolean;
  initialStarred: boolean;
  status: string;
}

export function NonPlayableView(props: NonPlayableViewProps) {
  return (
    <div className="grid h-[calc(100dvh-3.5rem)] grid-cols-1 gap-4 p-4 lg:grid-cols-[minmax(280px,360px)_1fr]">
      <ContextPane
        slug={props.slug}
        title={props.title}
        difficulty={props.difficulty}
        categoryId={props.categoryId}
        categoryName={props.categoryName}
        leetcodeUrl={props.leetcodeUrl}
        isPremium={props.isPremium}
        initialStarred={props.initialStarred}
        status={props.status}
        challenge={null}
      />

      <div className="panel flex min-h-0 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="grid size-14 place-items-center rounded-2xl border border-edge bg-surface-raised text-muted-foreground">
          <FlaskConical className="size-6" />
        </div>
        <div className="max-w-sm">
          <h2 className="font-display text-lg font-semibold">
            No in-app tests yet
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            This problem has structured input (trees, linked lists, graphs, or
            a design API) that the in-browser harness doesn&apos;t run yet.
            Solve it on LeetCode for now — its progress will land here once it
            becomes playable.
          </p>
        </div>
        <a
          href={props.leetcodeUrl}
          target="_blank"
          rel="noreferrer"
          className="glow-accent inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open on LeetCode
          <ExternalLink className="size-4" />
        </a>
      </div>
    </div>
  );
}
