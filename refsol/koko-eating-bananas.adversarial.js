// Independent approach: closed-interval binary search [lo, hi] tracking the
// best feasible answer, with hours computed via integer ceiling without
// floating point. Predicate is monotonic in k, so we shrink toward smallest
// feasible speed.
export function minEatingSpeed(piles, h) {
  const hoursNeeded = (k) => {
    let total = 0;
    for (const p of piles) {
      total += Math.floor((p + k - 1) / k); // ceil(p/k) for positive ints
    }
    return total;
  };

  let lo = 1;
  let hi = Math.max(...piles);
  let best = hi;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (hoursNeeded(mid) <= h) {
      best = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return best;
}
