// Independent approach: maintain a max-heap of size k keyed by squared distance.
// Keep the k smallest distances; differs from the author's full-sort approach.

class MaxHeap {
  constructor() {
    this.a = [];
  }
  size() {
    return this.a.length;
  }
  peek() {
    return this.a[0];
  }
  push(item) {
    const a = this.a;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p].d >= a[i].d) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      const n = a.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let largest = i;
        if (l < n && a[l].d > a[largest].d) largest = l;
        if (r < n && a[r].d > a[largest].d) largest = r;
        if (largest === i) break;
        [a[largest], a[i]] = [a[i], a[largest]];
        i = largest;
      }
    }
    return top;
  }
}

export function kClosest(points, k) {
  const heap = new MaxHeap();
  for (const p of points) {
    const d = p[0] * p[0] + p[1] * p[1];
    if (heap.size() < k) {
      heap.push({ d, p });
    } else if (d < heap.peek().d) {
      heap.pop();
      heap.push({ d, p });
    }
  }
  const out = [];
  while (heap.size() > 0) {
    out.push(heap.pop().p);
  }
  return out;
}
