// Independent O(n^2) brute-force approach: try every starting station and
// simulate the full circuit. Returns the smallest valid start index, or -1.
export function canCompleteCircuit(gas, cost) {
  const n = gas.length;
  for (let start = 0; start < n; start++) {
    let tank = 0;
    let ok = true;
    for (let step = 0; step < n; step++) {
      const i = (start + step) % n;
      tank += gas[i] - cost[i];
      if (tank < 0) {
        ok = false;
        break;
      }
    }
    if (ok) return start;
  }
  return -1;
}
