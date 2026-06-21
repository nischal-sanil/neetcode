// Independent approach: build an explicit monotonic stack of arrival times.
// Cars are processed from closest-to-target to farthest. A car forms a new
// fleet only if its arrival time is strictly greater than the time already on
// top of the stack (the fleet ahead of it). Otherwise it catches up and merges.
// The number of fleets is the final stack size.
export function carFleet(target, position, speed) {
  const cars = position.map((p, i) => [p, speed[i]]);
  // sort by position descending (closest to target first)
  cars.sort((a, b) => b[0] - a[0]);

  const stack = []; // arrival times of fleet leaders
  for (const [pos, spd] of cars) {
    const time = (target - pos) / spd;
    if (stack.length === 0 || time > stack[stack.length - 1]) {
      stack.push(time);
    }
    // else: this car merges into the fleet ahead; do not push.
  }
  return stack.length;
}
