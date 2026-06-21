// Independent approach: find pivot (smallest element index) via binary search,
// then binary-search the appropriate sorted half.
export function search(nums, target) {
  const n = nums.length;
  if (n === 0) return -1;

  // Find index of minimum element (pivot) using binary search.
  let lo = 0, hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  const pivot = lo; // index of smallest element

  // Decide which sorted segment target could be in.
  let left, right;
  if (target >= nums[pivot] && target <= nums[n - 1]) {
    left = pivot;
    right = n - 1;
  } else {
    left = 0;
    right = pivot - 1;
  }

  // Plain binary search on [left, right].
  while (left <= right) {
    const mid = (left + right) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
