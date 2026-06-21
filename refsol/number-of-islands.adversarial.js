// Independent reference: BFS flood fill with a queue (author uses iterative DFS stack).
export function numIslands(grid) {
  if (!grid || grid.length === 0 || grid[0].length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1" && !visited[r][c]) {
        count++;
        // BFS
        const queue = [[r, c]];
        visited[r][c] = true;
        while (queue.length > 0) {
          const [cr, cc] = queue.shift();
          const neighbors = [
            [cr + 1, cc],
            [cr - 1, cc],
            [cr, cc + 1],
            [cr, cc - 1],
          ];
          for (const [nr, nc] of neighbors) {
            if (
              nr >= 0 &&
              nr < rows &&
              nc >= 0 &&
              nc < cols &&
              !visited[nr][nc] &&
              grid[nr][nc] === "1"
            ) {
              visited[nr][nc] = true;
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }
  return count;
}
