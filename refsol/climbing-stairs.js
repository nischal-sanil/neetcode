export function climbStairs(n) {
  const memo = {};
  function ways(k) {
    if (k <= 2) return k === 0 ? 1 : k;
    if (memo[k] !== undefined) return memo[k];
    return (memo[k] = ways(k - 1) + ways(k - 2));
  }
  return ways(n);
}
