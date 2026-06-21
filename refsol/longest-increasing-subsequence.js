export function lengthOfLIS(nums) {
  // Independent O(n^2) DP, distinct from the patience-sorting Python reference.
  const n = nums.length;
  if (n === 0) return 0;
  const dp = new Array(n).fill(1);
  let best = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
      }
    }
    if (dp[i] > best) best = dp[i];
  }
  return best;
}
