"use server";

import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { codeDrafts } from "@/lib/db/schema";

type SaveDraftInput = {
  slug: string;
  language: string;
  code: string;
};

/**
 * Upsert the per-problem, per-language draft. Called debounced from the
 * editor so a refresh never loses in-progress code. No revalidation: drafts
 * are client-restored, not part of any rendered server tree.
 */
export async function saveDraft({
  slug,
  language,
  code,
}: SaveDraftInput): Promise<void> {
  await db
    .insert(codeDrafts)
    .values({ slug, language, code })
    .onConflictDoUpdate({
      target: [codeDrafts.slug, codeDrafts.language],
      set: { code, updatedAt: sql`now()` },
    });
}
