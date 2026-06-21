// Independent BFS approach (author uses recursive DFS).
// BFS outward from each ocean border; a cell flows to an ocean if water can
// travel from that cell to the border, i.e. reachable going to NON-LOWER cells.
export function pacificAtlantic(heights) {
  if (!heights || heights.length === 0 || heights[0].length === 0) return [];
  const rows = heights.length;
  const cols = heights[0].length;

  const bfs = (starts) => {
    const reach = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const queue = [];
    for (const [r, c] of starts) {
      if (!reach[r][c]) {
        reach[r][c] = true;
        queue.push([r, c]);
      }
    }
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (queue.length) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (reach[nr][nc]) continue;
        if (heights[nr][nc] < heights[r][c]) continue;
        reach[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
    return reach;
  };

  const pacificStarts = [];
  const atlanticStarts = [];
  for (let c = 0; c < cols; c++) {
    pacificStarts.push([0, c]);
    atlanticStarts.push([rows - 1, c]);
  }
  for (let r = 0; r < rows; r++) {
    pacificStarts.push([r, 0]);
    atlanticStarts.push([r, cols - 1]);
  }

  const pac = bfs(pacificStarts);
  const atl = bfs(atlanticStarts);

  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pac[r][c] && atl[r][c]) result.push([r, c]);
    }
  }
  return result;
}
