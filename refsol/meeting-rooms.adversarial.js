// Independent approach: sweep-line event counting.
// Create +1 events at meeting starts and -1 at ends, sort events,
// and track concurrently-active meetings. If the active count ever
// exceeds 1, two meetings overlap and the person cannot attend all.
// Ties: process end events (-1) before start events (+1) at the same
// time, since [a,b] and [b,c] do not overlap.
export function canAttendMeetings(intervals) {
  const events = [];
  for (const [start, end] of intervals) {
    events.push([start, 1]);
    events.push([end, -1]);
  }
  events.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

  let active = 0;
  for (const [, delta] of events) {
    active += delta;
    if (active > 1) return false;
  }
  return true;
}
