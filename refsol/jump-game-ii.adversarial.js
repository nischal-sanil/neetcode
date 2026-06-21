// Independent reference: bottom-up dynamic programming.
// dp[i] = minimum jumps to reach the last index starting from i.
// Different algorithm from the greedy O(n) reference.
export function jump(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(Infinity);
  dp[n - 1] = 0;
  for (let i = n - 2; i >= 0; i--) {
    const maxReach = Math.min(i + nums[i], n - 1);
    for (let j = i + 1; j <= maxReach; j++) {
      if (dp[j] + 1 < dp[i]) {
        dp[i] = dp[j] + 1;
      }
    }
  }
  return dp[0];
}
