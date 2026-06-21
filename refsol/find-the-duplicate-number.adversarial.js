// Independent approach: frequency counting with a Set (different from Floyd's cycle detection).
export function findDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return n;
    seen.add(n);
  }
  // Per problem constraints a duplicate always exists; this is unreachable.
  return -1;
}
