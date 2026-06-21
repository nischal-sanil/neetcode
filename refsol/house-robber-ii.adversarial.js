// Independent approach: explicit DP arrays over a linear range [lo, hi].
// dp[i] = best loot considering houses lo..i. Circular constraint handled
// by running two separate linear ranges (drop first house, or drop last house)
// and taking the max. Different from the rolling-variable Python ref.
export function rob(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];

  function robRange(lo, hi) {
    // inclusive range; if empty, 0
    if (lo > hi) return 0;
    const dp = new Array(hi - lo + 1).fill(0);
    for (let i = lo; i <= hi; i++) {
      const idx = i - lo;
      const take = nums[i] + (idx >= 2 ? dp[idx - 2] : 0);
      const skip = idx >= 1 ? dp[idx - 1] : 0;
      dp[idx] = Math.max(take, skip);
    }
    return dp[dp.length - 1];
  }

  // Either rob houses [0 .. n-2] (exclude last) or [1 .. n-1] (exclude first)
  return Math.max(robRange(0, n - 2), robRange(1, n - 1));
}
