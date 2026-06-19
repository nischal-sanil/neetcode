import { notFound } from "next/navigation";

import {
  getCategoryById,
  getChallenge,
  getProblemBySlug,
} from "@/lib/data/content";
import { getDraft, getProgressForSlug } from "@/lib/db/queries";

import { SolveView } from "@/components/solve/SolveView";
import { NonPlayableView } from "@/components/solve/NonPlayableView";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const problem = getProblemBySlug(slug);
  if (!problem) notFound();

  const challenge = getChallenge(slug);
  const category = getCategoryById(problem.category);
  const progress = await getProgressForSlug(slug);

  const shared = {
    slug,
    title: problem.title,
    difficulty: problem.difficulty,
    categoryId: problem.category,
    categoryName: category?.name ?? problem.category,
    leetcodeUrl: problem.leetcode_url,
    isPremium: problem.is_premium,
    initialStarred: progress?.starred ?? false,
    status: progress?.status ?? "not_started",
  };

  if (!challenge) {
    return <NonPlayableView {...shared} />;
  }

  const [pythonDraft, javascriptDraft] = await Promise.all([
    getDraft(slug, "python"),
    getDraft(slug, "javascript"),
  ]);

  return (
    <SolveView
      {...shared}
      challenge={challenge}
      drafts={{ python: pythonDraft, javascript: javascriptDraft }}
    />
  );
}
