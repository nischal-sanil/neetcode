// Independent reference: recursive binary search (different approach from the
// author's iterative loop).
export function search(nums, target) {
  function go(lo, hi) {
    if (lo > hi) return -1;
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) return go(mid + 1, hi);
    return go(lo, mid - 1);
  }
  return go(0, nums.length - 1);
}
