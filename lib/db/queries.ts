import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { codeDrafts, problemProgress, submissions } from "@/lib/db/schema";
import type { Submission } from "@/lib/db/schema";

export type ProgressEntry = {
  status: string;
  starred: boolean;
  attempts: number;
  solvedAt: Date | null;
};

export type ProgressMap = Record<string, ProgressEntry>;

/**
 * Raw per-slug progress for every row. The roadmap joins this with the
 * static content (which lives outside the DB) to derive per-category counts.
 */
export async function getProgressMap(): Promise<ProgressMap> {
  const rows = await db.select().from(problemProgress);
  const map: ProgressMap = {};
  for (const row of rows) {
    map[row.slug] = {
      status: row.status,
      starred: row.starred,
      attempts: row.attempts,
      solvedAt: row.solvedAt,
    };
  }
  return map;
}

export async function getProgressForSlug(
  slug: string,
): Promise<ProgressEntry | null> {
  const [row] = await db
    .select()
    .from(problemProgress)
    .where(eq(problemProgress.slug, slug))
    .limit(1);
  if (!row) return null;
  return {
    status: row.status,
    starred: row.starred,
    attempts: row.attempts,
    solvedAt: row.solvedAt,
  };
}

export async function getDraft(
  slug: string,
  language: string,
): Promise<string | null> {
  const [row] = await db
    .select({ code: codeDrafts.code })
    .from(codeDrafts)
    .where(and(eq(codeDrafts.slug, slug), eq(codeDrafts.language, language)))
    .limit(1);
  return row?.code ?? null;
}

export async function listSubmissions(slug: string): Promise<Submission[]> {
  return db
    .select()
    .from(submissions)
    .where(eq(submissions.slug, slug))
    .orderBy(desc(submissions.createdAt));
}
