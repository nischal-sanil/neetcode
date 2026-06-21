// Independent approach: single-queue BFS carrying a per-cell timestamp.
// Each rotten cell spreads to fresh neighbors stamped time+1; the answer is the
// max stamp reached, or -1 if any fresh cell is never stamped.
export function orangesRotting(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c, 0]);
      else if (grid[r][c] === 1) fresh++;
    }
  }

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  let maxTime = 0;
  let head = 0;
  while (head < queue.length) {
    const [r, c, t] = queue[head++];
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (grid[nr][nc] !== 1) continue;
      grid[nr][nc] = 2;
      fresh--;
      const nt = t + 1;
      if (nt > maxTime) maxTime = nt;
      queue.push([nr, nc, nt]);
    }
  }

  return fresh === 0 ? maxTime : -1;
}
