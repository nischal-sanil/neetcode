// Independent reference: top-down recursion with memoization (different
// approach from the O(1) rolling-variable DP in house-robber.py).
export function rob(nums) {
  const memo = new Map();
  function best(i) {
    if (i >= nums.length) return 0;
    if (memo.has(i)) return memo.get(i);
    const take = nums[i] + best(i + 2);
    const skip = best(i + 1);
    const result = Math.max(take, skip);
    memo.set(i, result);
    return result;
  }
  return best(0);
}
