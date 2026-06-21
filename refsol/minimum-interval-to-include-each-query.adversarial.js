// Independent reference: brute-force scan.
// For each query, examine every interval that contains it and take the
// minimum size. Completely different algorithm from the sort+min-heap
// offline approach (no sorting, no heap, no offline ordering).
export function minInterval(intervals, queries) {
  return queries.map((q) => {
    let best = -1;
    for (const [l, r] of intervals) {
      if (l <= q && q <= r) {
        const size = r - l + 1;
        if (best === -1 || size < best) {
          best = size;
        }
      }
    }
    return best;
  });
}
