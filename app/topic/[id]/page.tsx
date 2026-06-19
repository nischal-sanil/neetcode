import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  getCategoryById,
  getProblemsByCategory,
} from "@/lib/data/content";
import { getProgressMap } from "@/lib/db/queries";
import { ProgressRing } from "@/components/ui/progress-ring";
import { ProblemList } from "@/components/topic/ProblemList";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = getCategoryById(id);
  if (!category) notFound();

  const problems = getProblemsByCategory(id);
  const progressMap = await getProgressMap();

  const total = problems.length;
  const solved = problems.reduce(
    (n, p) => (progressMap[p.slug]?.status === "solved" ? n + 1 : n),
    0,
  );
  const fraction = total > 0 ? solved / total : 0;

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Roadmap
      </Link>

      <header className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            {category.name}
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
            {category.blurb}
          </p>
          <p className="mt-3 text-xs font-medium tracking-wide text-muted-foreground tabular-nums">
            <span className="text-foreground">{solved}</span> of {total} solved
          </p>
        </div>

        <ProgressRing
          value={fraction}
          size={64}
          stroke={5}
          label={
            <span className="text-xs font-semibold tabular-nums">
              {solved}/{total}
            </span>
          }
          className="shrink-0"
        />
      </header>

      <div className="mt-8">
        <ProblemList problems={problems} progressMap={progressMap} />
      </div>
    </div>
  );
}
