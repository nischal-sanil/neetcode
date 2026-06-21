// Independent reference using Quickselect (Lomuto partition).
// Finds the kth largest by targeting index (n - k) in ascending order.
export function findKthLargest(nums, k) {
  const a = nums.slice();
  const target = a.length - k; // index in ascending sorted order

  function partition(lo, hi) {
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (a[j] <= pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    return i;
  }

  let lo = 0;
  let hi = a.length - 1;
  while (lo <= hi) {
    const p = partition(lo, hi);
    if (p === target) return a[p];
    if (p < target) lo = p + 1;
    else hi = p - 1;
  }
  return -1; // unreachable for valid input
}
