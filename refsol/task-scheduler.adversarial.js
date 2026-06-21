// Greedy simulation: at each step, schedule the available task with the
// highest remaining count; cooled-down tasks wait in a queue until ready.
// Different approach from the author's closed-form math formula.
export function leastInterval(tasks, n) {
  const counts = new Map();
  for (const t of tasks) counts.set(t, (counts.get(t) || 0) + 1);

  // max-heap of remaining counts (simple array, re-sorted each pick)
  let heap = [...counts.values()];
  let time = 0;
  // cooldown queue: [readyTime, count]
  const cooling = [];

  while (heap.length > 0 || cooling.length > 0) {
    time++;
    if (heap.length > 0) {
      heap.sort((a, b) => b - a);
      let cnt = heap.shift() - 1;
      if (cnt > 0) cooling.push([time + n, cnt]);
    }
    // release tasks whose cooldown finished
    if (cooling.length > 0 && cooling[0][0] === time) {
      heap.push(cooling.shift()[1]);
    }
  }
  return time;
}
