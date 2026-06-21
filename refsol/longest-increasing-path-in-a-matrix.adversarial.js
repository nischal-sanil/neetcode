// Independent approach: topological sort (Kahn's algorithm) on the DAG where
// an edge goes from a cell to a strictly-greater neighbor. The longest path
// length equals the number of "peeling" rounds, processing cells with
// out-degree 0 (local maxima reachable along increasing edges) layer by layer.
export function longestIncreasingPath(matrix) {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) return 0;
  const rows = matrix.length;
  const cols = matrix[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // outdeg[r][c] = number of strictly-greater neighbors (outgoing edges).
  const outdeg = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c]) {
          outdeg[r][c]++;
        }
      }
    }
  }

  // Start from sinks (out-degree 0) and peel inward.
  let queue = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (outdeg[r][c] === 0) queue.push([r, c]);
    }
  }

  let length = 0;
  while (queue.length > 0) {
    length++;
    const next = [];
    for (const [r, c] of queue) {
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        // Reverse edge: a smaller neighbor points to this cell.
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] < matrix[r][c]) {
          outdeg[nr][nc]--;
          if (outdeg[nr][nc] === 0) next.push([nr, nc]);
        }
      }
    }
    queue = next;
  }

  return length;
}
