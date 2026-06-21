// Independent approach: build an interval [first, last] for each distinct
// character, sort by start, then merge overlapping intervals. Each merged
// interval is one partition; its size is the partition length.
export function partitionLabels(s) {
  const first = {};
  const last = {};
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!(c in first)) first[c] = i;
    last[c] = i;
  }

  const intervals = Object.keys(first).map((c) => [first[c], last[c]]);
  intervals.sort((a, b) => a[0] - b[0]);

  const result = [];
  if (intervals.length === 0) return result;

  let curStart = intervals[0][0];
  let curEnd = intervals[0][1];
  for (let k = 1; k < intervals.length; k++) {
    const [s0, e0] = intervals[k];
    if (s0 <= curEnd) {
      curEnd = Math.max(curEnd, e0);
    } else {
      result.push(curEnd - curStart + 1);
      curStart = s0;
      curEnd = e0;
    }
  }
  result.push(curEnd - curStart + 1);
  return result;
}
