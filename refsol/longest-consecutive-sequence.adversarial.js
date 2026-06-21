// Independent approach: sort, then scan for the longest run of consecutive ints.
export function longestConsecutive(nums) {
  if (nums.length === 0) return 0;
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  let best = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      cur += 1;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  return best;
}
