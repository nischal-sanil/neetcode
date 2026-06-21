// Independent reference: brute-force max over each window.
// Different approach from the author's monotonic deque.
export function maxSlidingWindow(nums, k) {
  const out = [];
  for (let i = 0; i + k <= nums.length; i++) {
    let m = nums[i];
    for (let j = i + 1; j < i + k; j++) {
      if (nums[j] > m) m = nums[j];
    }
    out.push(m);
  }
  return out;
}
