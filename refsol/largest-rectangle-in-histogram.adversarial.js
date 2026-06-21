// Adversarial reference: divide & conquer (different from the author's
// monotonic stack). For a range, the smallest bar bounds a rectangle spanning
// the whole range; the best answer is that, or lies entirely in the left or
// right subrange split at the minimum.
export function largestRectangleArea(heights) {
  function solve(lo, hi) {
    if (lo > hi) return 0;
    let minIdx = lo;
    for (let i = lo; i <= hi; i++) {
      if (heights[i] < heights[minIdx]) minIdx = i;
    }
    const spanning = heights[minIdx] * (hi - lo + 1);
    const left = solve(lo, minIdx - 1);
    const right = solve(minIdx + 1, hi);
    return Math.max(spanning, left, right);
  }
  return solve(0, heights.length - 1);
}
