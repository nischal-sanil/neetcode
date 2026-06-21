// Independent approach: top-down recursion with memoization over (index, remaining).
// Different from the existing Python ref, which forward-builds a set of reachable subset sums.
export function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;

  const memo = new Map();
  function dfs(i, remaining) {
    if (remaining === 0) return true;
    if (remaining < 0 || i === nums.length) return false;
    const key = i * (target + 1) + remaining;
    if (memo.has(key)) return memo.get(key);
    // include nums[i] or skip it
    const result = dfs(i + 1, remaining - nums[i]) || dfs(i + 1, remaining);
    memo.set(key, result);
    return result;
  }

  return dfs(0, target);
}
