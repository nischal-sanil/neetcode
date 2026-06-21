export function swimInWater(grid) {
  const n = grid.length;
  const lo = grid[0][0];
  let hi = 0;
  for (const row of grid) for (const v of row) hi = Math.max(hi, v);

  const canReach = (t) => {
    if (grid[0][0] > t) return false;
    const seen = Array.from({ length: n }, () => new Array(n).fill(false));
    const stack = [[0, 0]];
    seen[0][0] = true;
    while (stack.length) {
      const [r, c] = stack.pop();
      if (r === n - 1 && c === n - 1) return true;
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && !seen[nr][nc] && grid[nr][nc] <= t) {
          seen[nr][nc] = true;
          stack.push([nr, nc]);
        }
      }
    }
    return false;
  };

  let result = hi;
  let l = lo;
  let h = hi;
  while (l <= h) {
    const mid = (l + h) >> 1;
    if (canReach(mid)) {
      result = mid;
      h = mid - 1;
    } else {
      l = mid + 1;
    }
  }
  return result;
}
