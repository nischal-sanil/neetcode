export function maxProduct(nums) {
  // Independent approach: scan products from both directions.
  const n = nums.length;
  let best = nums[0];
  let prefix = 0;
  let suffix = 0;
  for (let i = 0; i < n; i++) {
    prefix = (prefix === 0 ? 1 : prefix) * nums[i];
    suffix = (suffix === 0 ? 1 : suffix) * nums[n - 1 - i];
    best = Math.max(best, prefix, suffix);
  }
  return best;
}
