// Different approach than the author's min-heap: keep a fully sorted ascending
// array and binary-search the insertion point on each add, then read the kth
// largest by index from the end.
export class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.sorted = [...nums].sort((a, b) => a - b);
  }

  add(val) {
    // binary search for insertion index (lower bound)
    let lo = 0;
    let hi = this.sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.sorted[mid] < val) lo = mid + 1;
      else hi = mid;
    }
    this.sorted.splice(lo, 0, val);
    return this.sorted[this.sorted.length - this.k];
  }
}
