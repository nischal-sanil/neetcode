export function maxCoins(nums) {
  const balloons = [1, ...nums, 1];
  const n = balloons.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let length = 2; length < n; length++) {
    for (let left = 0; left + length < n; left++) {
      const right = left + length;
      let best = 0;
      for (let k = left + 1; k < right; k++) {
        const coins =
          balloons[left] * balloons[k] * balloons[right] +
          dp[left][k] +
          dp[k][right];
        if (coins > best) best = coins;
      }
      dp[left][right] = best;
    }
  }
  return dp[0][n - 1];
}
