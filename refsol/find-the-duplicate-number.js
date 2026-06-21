export function findDuplicate(nums) {
  // Negative-marking via index visitation (distinct from Floyd's in the .py ref).
  for (const n of nums) {
    const idx = Math.abs(n);
    if (nums[idx] < 0) return idx;
    nums[idx] = -nums[idx];
  }
  return -1;
}
