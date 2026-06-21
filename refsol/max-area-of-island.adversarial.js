// Independent reference: iterative BFS with a visited set (does not mutate grid).
export function maxAreaOfIsland(grid) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set();
  let best = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== 1 || visited.has(r * cols + c)) continue;
      let area = 0;
      const queue = [[r, c]];
      visited.add(r * cols + c);
      while (queue.length > 0) {
        const [cr, cc] = queue.pop();
        area++;
        const neighbors = [
          [cr + 1, cc],
          [cr - 1, cc],
          [cr, cc + 1],
          [cr, cc - 1],
        ];
        for (const [nr, nc] of neighbors) {
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          const key = nr * cols + nc;
          if (grid[nr][nc] === 1 && !visited.has(key)) {
            visited.add(key);
            queue.push([nr, nc]);
          }
        }
      }
      if (area > best) best = area;
    }
  }
  return best;
}
