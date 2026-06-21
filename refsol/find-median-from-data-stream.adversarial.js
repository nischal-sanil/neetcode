// Adversarial reference: maintain a single sorted array via binary-search
// insertion, then read the median directly by index. Different approach from
// the author's two-heap balancing solution.
export class MedianFinder {
  constructor() {
    this.nums = [];
  }

  addNum(num) {
    // Binary search for the insertion index that keeps `nums` sorted.
    let lo = 0;
    let hi = this.nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.nums[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    this.nums.splice(lo, 0, num);
  }

  findMedian() {
    const n = this.nums.length;
    const mid = n >> 1;
    if (n % 2 === 1) return this.nums[mid];
    return (this.nums[mid - 1] + this.nums[mid]) / 2;
  }
}
