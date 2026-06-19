"use server";

import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { problemProgress, submissions } from "@/lib/db/schema";

type RecordRunInput = {
  slug: string;
  language: string;
  passed: boolean;
  passedCases: number;
  totalCases: number;
  runtimeMs?: number;
};

/**
 * The single centralized status-transition point. UI must never write
 * problem_progress.status directly — every run goes through here.
 *
 * - increments attempts
 * - 'not_started' -> 'attempted' on any run
 * - any passing run sets status 'solved' and stamps solvedAt (once)
 * - records a submissions row
 */
export async function recordRun({
  slug,
  language,
  passed,
  passedCases,
  totalCases,
  runtimeMs,
}: RecordRunInput): Promise<void> {
  await db
    .insert(problemProgress)
    .values({
      slug,
      status: passed ? "solved" : "attempted",
      attempts: 1,
      solvedAt: passed ? new Date() : null,
    })
    .onConflictDoUpdate({
      target: problemProgress.slug,
      set: {
        attempts: sql`${problemProgress.attempts} + 1`,
        // 'solved' is terminal; otherwise advance to at least 'attempted'.
        status: passed
          ? sql`'solved'`
          : sql`CASE WHEN ${problemProgress.status} = 'solved' THEN 'solved' ELSE 'attempted' END`,
        // stamp solvedAt the first time it is solved, keep the original after.
        solvedAt: passed
          ? sql`COALESCE(${problemProgress.solvedAt}, now())`
          : sql`${problemProgress.solvedAt}`,
        updatedAt: sql`now()`,
      },
    });

  await db.insert(submissions).values({
    slug,
    language,
    passed,
    passedCases,
    totalCases,
    runtimeMs: runtimeMs ?? null,
  });

  revalidatePath("/");
  revalidatePath(`/problem/${slug}`);
  revalidatePath("/topic/[id]", "page");
}

/**
 * Toggle the starred flag for a problem. Returns the new value.
 */
export async function toggleStar(slug: string): Promise<boolean> {
  const [row] = await db
    .insert(problemProgress)
    .values({ slug, starred: true })
    .onConflictDoUpdate({
      target: problemProgress.slug,
      set: {
        starred: sql`NOT ${problemProgress.starred}`,
        updatedAt: sql`now()`,
      },
    })
    .returning({ starred: problemProgress.starred });

  revalidatePath("/");
  revalidatePath(`/problem/${slug}`);
  revalidatePath("/topic/[id]", "page");

  return row.starred;
}
