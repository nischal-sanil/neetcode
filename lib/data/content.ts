// Pure content accessors over the static /data JSON.
// No DB, no React, no 'use client'/'use server' — usable from server components.

import categoriesJson from "@/data/categories.json";
import problemsJson from "@/data/problems.json";
import { challenges } from "@/data/challenges/index";

import type {
  CategoriesFile,
  Category,
  Challenge,
  GraphEdge,
  GraphNode,
  Problem,
  ProblemsFile,
} from "./types";

const categoriesFile = categoriesJson as CategoriesFile;
const problemsFile = problemsJson as ProblemsFile;

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
  return challenges[slug] ?? null;
}

export function isPlayable(slug: string): boolean {
  return slug in challenges;
}
