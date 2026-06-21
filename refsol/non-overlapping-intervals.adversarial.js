// Independent approach: sort by START time, scan keeping the currently
// "kept" interval. On an overlap, remove one interval and keep whichever
// has the smaller end (so future intervals are least likely to clash).
// This differs from the reference (which sorts by END and greedily counts).
export function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  let removed = 0;
  let prevEnd = sorted[0][1];
  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    if (start < prevEnd) {
      // overlap: drop one. Keep the smaller end.
      removed += 1;
      prevEnd = Math.min(prevEnd, end);
    } else {
      prevEnd = end;
    }
  }
  return removed;
}
