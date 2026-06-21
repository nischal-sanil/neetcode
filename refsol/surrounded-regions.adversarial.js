// Independent approach: Union-Find. Connect every 'O' cell to its 'O' neighbors,
// and union any border 'O' with a virtual "safe" node. Afterwards, any 'O' not
// in the safe component is fully surrounded and gets flipped to 'X'. This differs
// from the author's border-DFS flood fill.
export function solve(board) {
  if (!board || board.length === 0 || board[0].length === 0) return;
  const rows = board.length;
  const cols = board[0].length;
  const SAFE = rows * cols; // virtual node index

  const parent = new Array(rows * cols + 1);
  for (let i = 0; i <= rows * cols; i++) parent[i] = i;

  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }

  const idx = (r, c) => r * cols + c;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== "O") continue;
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        union(idx(r, c), SAFE);
      }
      if (r + 1 < rows && board[r + 1][c] === "O") union(idx(r, c), idx(r + 1, c));
      if (c + 1 < cols && board[r][c + 1] === "O") union(idx(r, c), idx(r, c + 1));
    }
  }

  const safeRoot = find(SAFE);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === "O" && find(idx(r, c)) !== safeRoot) {
        board[r][c] = "X";
      }
    }
  }
}
