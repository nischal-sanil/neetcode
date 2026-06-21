// Independent approach: top-down memoized recursion from the top.
// minCost(i) = minimum cost to reach step i (the top is index n, beyond the array).
// minCost(i) = cost[i] + min(minCost(i-1), minCost(i-2)) for the cost paid to step on i.
// Answer is the min cost to stand at the top: min(reach(n-1), reach(n-2)),
// where reach(j) is the total cost to step on stair j.
export function minCostClimbingStairs(cost) {
  const n = cost.length;
  const memo = new Map();

  // reach(j): total cost incurred to stand on stair j (j may be -1 or -2 = ground, cost 0)
  function reach(j) {
    if (j < 0) return 0;
    if (memo.has(j)) return memo.get(j);
    const val = cost[j] + Math.min(reach(j - 1), reach(j - 2));
    memo.set(j, val);
    return val;
  }

  return Math.min(reach(n - 1), reach(n - 2));
}
