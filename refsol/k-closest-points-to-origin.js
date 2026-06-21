export function kClosest(points, k) {
  // Independent approach: max-distance selection by repeatedly picking the
  // current closest remaining point k times.
  const dist = (p) => p[0] * p[0] + p[1] * p[1];
  const remaining = points.map((p) => [p[0], p[1]]);
  const result = [];
  for (let n = 0; n < k && remaining.length > 0; n++) {
    let best = 0;
    for (let i = 1; i < remaining.length; i++) {
      if (dist(remaining[i]) < dist(remaining[best])) best = i;
    }
    result.push(remaining[best]);
    remaining.splice(best, 1);
  }
  return result;
}
