// Independent reference: reduce Target Sum to subset-sum counting.
// Assign each number + or -. Let P = numbers given +, N = numbers given -.
// sum(P) - sum(N) = target and sum(P) + sum(N) = S (total).
// => sum(P) = (target + S) / 2. Count subsets with that sum.
// Different algorithm from the existing hashmap-over-totals reference.
export function findTargetSumWays(nums, target) {
  const S = nums.reduce((a, b) => a + b, 0);
  const need = target + S;
  // No solution if (target + S) is negative or odd.
  if (need < 0 || need % 2 !== 0) return 0;
  const subsetSum = need / 2;

  // dp[s] = number of subsets summing to s, using 0/1 knapsack counting.
  const dp = new Array(subsetSum + 1).fill(0);
  dp[0] = 1;
  for (const n of nums) {
    for (let s = subsetSum; s >= n; s--) {
      dp[s] += dp[s - n];
    }
  }
  return dp[subsetSum];
}
