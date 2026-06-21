// Min-heap of size k; the root is the kth largest element in the stream.
export class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.heap = [];
    for (const n of nums) this._add(n);
  }

  _add(val) {
    this.heap.push(val);
    let i = this.heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.heap[parent] <= this.heap[i]) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
    if (this.heap.length > this.k) this._pop();
  }

  _pop() {
    const last = this.heap.pop();
    if (this.heap.length === 0) return;
    this.heap[0] = last;
    let i = 0;
    const n = this.heap.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
      if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }

  add(val) {
    this._add(val);
    return this.heap[0];
  }
}
