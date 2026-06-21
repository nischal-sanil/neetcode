// Divide-and-conquer maximum subarray (independent of Kadane's).
export function maxSubArray(nums) {
  function solve(lo, hi) {
    if (lo === hi) return nums[lo];
    const mid = Math.floor((lo + hi) / 2);
    const left = solve(lo, mid);
    const right = solve(mid + 1, hi);

    // Best subarray crossing the midpoint.
    let leftSum = -Infinity;
    let sum = 0;
    for (let i = mid; i >= lo; i--) {
      sum += nums[i];
      if (sum > leftSum) leftSum = sum;
    }
    let rightSum = -Infinity;
    sum = 0;
    for (let i = mid + 1; i <= hi; i++) {
      sum += nums[i];
      if (sum > rightSum) rightSum = sum;
    }
    const cross = leftSum + rightSum;

    return Math.max(left, right, cross);
  }
  return solve(0, nums.length - 1);
}
