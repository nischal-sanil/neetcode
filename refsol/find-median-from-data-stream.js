// Sorted-array reference: insert in order, read the middle(s).
export class MedianFinder {
  constructor() {
    this.nums = [];
  }

  addNum(num) {
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
    const m = n >> 1;
    if (n % 2 === 1) return this.nums[m];
    return (this.nums[m - 1] + this.nums[m]) / 2;
  }
}
