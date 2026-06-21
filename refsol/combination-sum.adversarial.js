// Independent approach: bottom-up DP over target values.
// dp[t] = list of all combinations summing to t (each combination kept in
// non-decreasing order to dedupe). Different from the author's recursive
// backtracking with sorted pruning.
export function combinationSum(candidates, target) {
  const dp = [];
  for (let t = 0; t <= target; t++) dp.push([]);
  dp[0] = [[]];

  // Iterate candidates outer, values inner -> each combination is built in
  // candidate-index order, preventing permutation duplicates.
  for (const c of candidates) {
    for (let t = c; t <= target; t++) {
      for (const combo of dp[t - c]) {
        dp[t].push([...combo, c]);
      }
    }
  }
  return dp[target];
}
