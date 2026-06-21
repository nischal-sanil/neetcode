// Independent approach: simulate a walker with direction vectors,
// turning right whenever the next cell is out of bounds or already visited.
export function spiralOrder(matrix) {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) return [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const dr = [0, 1, 0, -1];
  const dc = [1, 0, -1, 0];
  const result = [];
  let r = 0;
  let c = 0;
  let dir = 0;
  for (let i = 0; i < rows * cols; i++) {
    result.push(matrix[r][c]);
    seen[r][c] = true;
    const nr = r + dr[dir];
    const nc = c + dc[dir];
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || seen[nr][nc]) {
      dir = (dir + 1) % 4;
    }
    r += dr[dir];
    c += dc[dir];
  }
  return result;
}
