// Independent approach: track seen numbers in a Set, toggling membership.
// Numbers appearing twice get added then removed; the single number remains.
export function singleNumber(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) {
      seen.delete(n);
    } else {
      seen.add(n);
    }
  }
  // Only the unique element is left in the set.
  for (const n of seen) {
    return n;
  }
}
