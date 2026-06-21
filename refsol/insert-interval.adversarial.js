// Independent approach: add newInterval to the list, sort by start,
// then merge overlapping intervals in a single pass.
// (Different from the three-phase scan that assumes pre-sorted input.)
export function insert(intervals, newInterval) {
  const all = intervals.map((iv) => [iv[0], iv[1]]);
  all.push([newInterval[0], newInterval[1]]);
  all.sort((a, b) => a[0] - b[0]);

  const res = [];
  for (const [s, e] of all) {
    if (res.length === 0 || res[res.length - 1][1] < s) {
      res.push([s, e]);
    } else {
      res[res.length - 1][1] = Math.max(res[res.length - 1][1], e);
    }
  }
  return res;
}
