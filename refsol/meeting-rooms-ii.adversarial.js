// Independent approach: chronological event sweep-line.
// Different from the heap reference: build separate sorted arrays of start
// and end times, then walk a two-pointer sweep counting concurrent meetings.
// A meeting ending exactly when another starts does NOT overlap, so we treat
// end-at-time-t as happening before start-at-time-t (start < end comparison).
export function minMeetingRooms(intervals) {
  if (intervals.length === 0) return 0;

  const starts = intervals.map((iv) => iv[0]).sort((a, b) => a - b);
  const ends = intervals.map((iv) => iv[1]).sort((a, b) => a - b);

  let rooms = 0;
  let maxRooms = 0;
  let s = 0;
  let e = 0;

  while (s < starts.length) {
    if (starts[s] < ends[e]) {
      rooms += 1;
      maxRooms = Math.max(maxRooms, rooms);
      s += 1;
    } else {
      rooms -= 1;
      e += 1;
    }
  }

  return maxRooms;
}
