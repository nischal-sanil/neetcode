// Independent approach: iterative power-set construction with dedup via a set
// of sorted-subset keys. Different from the author's recursive backtracking.
export function subsetsWithDup(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  let subsets = [[]];
  for (const x of sorted) {
    const next = [];
    for (const s of subsets) {
      next.push(s);
      next.push([...s, x]);
    }
    subsets = next;
  }
  const seen = new Set();
  const res = [];
  for (const s of subsets) {
    const key = JSON.stringify(s);
    if (!seen.has(key)) {
      seen.add(key);
      res.push(s);
    }
  }
  return res;
}
