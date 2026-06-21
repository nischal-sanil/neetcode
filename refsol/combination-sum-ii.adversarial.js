// Independent approach: collapse candidates into (value, count) pairs over
// distinct sorted values, then DFS choosing how many of each value (0..count).
// This avoids the i>start sibling-skip trick used by the author.
export function combinationSum2(candidates, target) {
  const counts = new Map();
  for (const c of candidates) counts.set(c, (counts.get(c) || 0) + 1);
  const vals = [...counts.keys()].sort((a, b) => a - b);

  const res = [];
  const combo = [];

  function dfs(idx, remaining) {
    if (remaining === 0) {
      res.push([...combo]);
      return;
    }
    if (idx >= vals.length) return;

    const v = vals[idx];
    const maxCount = counts.get(v);

    // option: take k copies of v (k from 0..maxCount), as long as k*v <= remaining
    for (let k = 0; k <= maxCount && k * v <= remaining; k++) {
      for (let j = 0; j < k; j++) combo.push(v);
      dfs(idx + 1, remaining - k * v);
      for (let j = 0; j < k; j++) combo.pop();
    }
  }

  dfs(0, target);
  return res;
}
