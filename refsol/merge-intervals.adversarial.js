// Independent approach: sweep-line over boundary events.
// Each interval contributes a +1 "start" event and a -1 "end" event. We sort
// the events and track active coverage; a merged interval spans from the point
// where coverage rises from 0 up to where it returns to 0. To merge intervals
// that merely touch (e.g. [1,4] and [4,5]), end events at a coordinate are
// processed AFTER start events at that same coordinate.
// This differs from the author's sort-by-start linear merge.
export function merge(intervals) {
  const events = [];
  for (const [start, end] of intervals) {
    events.push([start, 1]); // start: open
    events.push([end, -1]); // end: close
  }
  // Sort by coordinate; at equal coordinates, opens (+1) come before closes (-1)
  // so adjacent/touching intervals coalesce.
  events.sort((a, b) => (a[0] - b[0]) || (b[1] - a[1]));

  const result = [];
  let active = 0;
  let segStart = null;
  for (const [coord, delta] of events) {
    if (active === 0 && delta === 1) {
      segStart = coord;
    }
    active += delta;
    if (active === 0) {
      result.push([segStart, coord]);
    }
  }
  return result;
}
