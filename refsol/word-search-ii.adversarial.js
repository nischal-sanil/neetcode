// Independent approach: per-word backtracking DFS (no trie).
// For each word, try to find it on the board via plain exist() search.
export function findWords(board, words) {
  if (!board || board.length === 0 || board[0].length === 0) return [];
  const rows = board.length;
  const cols = board[0].length;

  function exists(word) {
    const dfs = (r, c, i) => {
      if (i === word.length) return true;
      if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
      if (board[r][c] !== word[i]) return false;
      const saved = board[r][c];
      board[r][c] = "*";
      const ok =
        dfs(r + 1, c, i + 1) ||
        dfs(r - 1, c, i + 1) ||
        dfs(r, c + 1, i + 1) ||
        dfs(r, c - 1, i + 1);
      board[r][c] = saved;
      return ok;
    };
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === word[0] && dfs(r, c, 0)) return true;
      }
    }
    return false;
  }

  const result = [];
  const seen = new Set();
  for (const word of words) {
    if (seen.has(word)) continue;
    seen.add(word);
    if (word.length > 0 && exists(word)) result.push(word);
  }
  return result;
}
