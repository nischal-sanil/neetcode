// Independent approach: binary search that compares mid against the right end,
// but formulated to find the pivot (rotation) index, then return nums[pivot].
// Distinct from the author's lo/hi convergence: here we explicitly locate the
// smallest element's index by narrowing on whether the left half is sorted.
export function findMin(nums) {
  let lo = 0;
  let hi = nums.length - 1;

  // If the array isn't rotated (or single element), the first element is min.
  if (nums[lo] <= nums[hi]) {
    return nums[lo];
  }

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    // The minimum is the only element smaller than its predecessor.
    if (mid > 0 && nums[mid] < nums[mid - 1]) {
      return nums[mid];
    }
    if (nums[mid] >= nums[0]) {
      // mid is in the left (higher) sorted portion; pivot is to the right.
      lo = mid + 1;
    } else {
      // mid is in the right (lower) portion; pivot is at or left of mid.
      hi = mid - 1;
    }
  }
  return nums[0];
}
