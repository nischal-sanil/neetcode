// Independent approach: iterative DFS using an explicit stack and a visited Set
// keyed by "r,c" plus the path-index, so the board is never mutated.
export function exist(board, word) {
  const rows = board.length;
  const cols = rows ? board[0].length : 0;
  if (word.length === 0) return true;
  if (rows === 0 || cols === 0) return false;

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // Try to grow a path from each starting cell.
  function search(sr, sc) {
    if (board[sr][sc] !== word[0]) return false;
    // Stack frames: { r, c, i, visited(Set of "r,c") }
    const stack = [{ r: sr, c: sc, i: 0, visited: new Set([sr + "," + sc]) }];
    while (stack.length) {
      const { r, c, i, visited } = stack.pop();
      if (i === word.length - 1) return true;
      const next = i + 1;
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const key = nr + "," + nc;
        if (visited.has(key)) continue;
        if (board[nr][nc] !== word[next]) continue;
        const nv = new Set(visited);
        nv.add(key);
        stack.push({ r: nr, c: nc, i: next, visited: nv });
      }
    }
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (search(r, c)) return true;
    }
  }
  return false;
}
