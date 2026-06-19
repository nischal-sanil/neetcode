// Pure content accessors over the static /data JSON.
// No DB, no React, no 'use client'/'use server' — usable from server components.

import categoriesJson from "@/data/categories.json";
import problemsJson from "@/data/problems.json";
import challengesJson from "@/data/challenges.json";

import type {
  CategoriesFile,
  Category,
  Challenge,
  ChallengesFile,
  GraphEdge,
  GraphNode,
  Problem,
  ProblemsFile,
} from "./types";

const categoriesFile = categoriesJson as CategoriesFile;
const problemsFile = problemsJson as ProblemsFile;
const challengesFile = challengesJson as ChallengesFile;

export function getCategories(): Category[] {
  return categoriesFile.categories;
}

export function getCategoriesGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  return categoriesFile.graph;
}

export function getCategoryById(id: string): Category | undefined {
  return categoriesFile.categories.find((c) => c.id === id);
}

export function getProblems(): Problem[] {
  return problemsFile.problems;
}

export function getProblemBySlug(slug: string): Problem | undefined {
  return problemsFile.problems.find((p) => p.slug === slug);
}

export function getProblemsByCategory(categoryId: string): Problem[] {
  return problemsFile.problems
    .filter((p) => p.category === categoryId)
    .sort((a, b) => a.order_in_category - b.order_in_category);
}

export function getChallenge(slug: string): Challenge | null {
  return challengesFile.challenges.find((c) => c.slug === slug) ?? null;
}

export function isPlayable(slug: string): boolean {
  return getProblemBySlug(slug)?.playable ?? false;
}
