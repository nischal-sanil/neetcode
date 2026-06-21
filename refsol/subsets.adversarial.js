// Iterative cascading approach (different from the author's recursive backtracking).
export function subsets(nums) {
  let res = [[]];
  for (const n of nums) {
    const next = [];
    for (const subset of res) {
      next.push([...subset, n]);
    }
    res = res.concat(next);
  }
  return res;
}
