// Pure comparison + copy helpers shared by both workers.
// No DOM / worker / Pyodide dependencies here so it is trivially testable.

import type { Comparison } from "./types";

/** Structural deep equality for JSON-able values (primitives, arrays, plain objects). */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  // NaN === NaN should be true for test comparisons.
  if (typeof a === "number" && typeof b === "number") {
    return Number.isNaN(a) && Number.isNaN(b);
  }

  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr !== bIsArr) return false;

  if (aIsArr && bIsArr) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const ao = a as Record<string, unknown>;
  const bo = b as Record<string, unknown>;
  const aKeys = Object.keys(ao);
  const bKeys = Object.keys(bo);
  if (aKeys.length !== bKeys.length) return false;
  for (const k of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(bo, k)) return false;
    if (!deepEqual(ao[k], bo[k])) return false;
  }
  return true;
}

/** Deep-copy args so a mutating solution can't corrupt later test cases. */
export function deepCopy<T>(v: T): T {
  try {
    return structuredClone(v);
  } catch {
    // Fallback for environments / values structuredClone rejects.
    return JSON.parse(JSON.stringify(v)) as T;
  }
}

/**
 * Total, deterministic ordering for mixed JSON primitives and structures.
 * Orders by a type rank first, then by value within a type, so arrays of
 * mixed primitives still sort stably and identically every run.
 */
function typeRank(v: unknown): number {
  if (v === null) return 0;
  if (v === undefined) return 1;
  switch (typeof v) {
    case "boolean":
      return 2;
    case "number":
      return 3;
    case "string":
      return 4;
    default:
      return Array.isArray(v) ? 5 : 6; // object
  }
}

function cmp(a: unknown, b: unknown): number {
  const ra = typeRank(a);
  const rb = typeRank(b);
  if (ra !== rb) return ra - rb;

  switch (ra) {
    case 0: // null
    case 1: // undefined
      return 0;
    case 2: // boolean
      return Number(a as boolean) - Number(b as boolean);
    case 3: {
      // number (NaN sorts last among numbers, deterministically)
      const na = a as number;
      const nb = b as number;
      if (Number.isNaN(na)) return Number.isNaN(nb) ? 0 : 1;
      if (Number.isNaN(nb)) return -1;
      return na < nb ? -1 : na > nb ? 1 : 0;
    }
    case 4: {
      const sa = a as string;
      const sb = b as string;
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    }
    default: {
      // arrays / objects: compare by a stable JSON serialization
      const sa = stableStringify(a);
      const sb = stableStringify(b);
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    }
  }
}

/** JSON with object keys sorted, so structurally-equal values stringify identically. */
function stableStringify(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v) ?? "null";
  if (Array.isArray(v)) {
    return "[" + v.map(stableStringify).join(",") + "]";
  }
  const o = v as Record<string, unknown>;
  const keys = Object.keys(o).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(o[k])).join(",") + "}";
}

function sortedCopy(arr: unknown[]): unknown[] {
  return [...arr].sort(cmp);
}

/**
 * Compare a produced value against the expected value under a comparison mode.
 * - exact: structural deep equality.
 * - set: both top-level values are arrays compared order-independently.
 * - nested-unordered: sort each inner array, then sort the outer list (3Sum / Group Anagrams style).
 */
export function compare(got: unknown, expected: unknown, mode: Comparison): boolean {
  switch (mode) {
    case "exact":
      return deepEqual(got, expected);

    case "set": {
      if (!Array.isArray(got) || !Array.isArray(expected)) return false;
      if (got.length !== expected.length) return false;
      return deepEqual(sortedCopy(got), sortedCopy(expected));
    }

    case "nested-unordered": {
      if (!Array.isArray(got) || !Array.isArray(expected)) return false;
      if (got.length !== expected.length) return false;
      const norm = (outer: unknown[]) =>
        sortedCopy(outer.map((inner) => (Array.isArray(inner) ? sortedCopy(inner) : inner)));
      return deepEqual(norm(got), norm(expected));
    }

    default:
      return deepEqual(got, expected);
  }
}
