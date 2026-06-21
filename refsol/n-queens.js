// Independent reference: column-permutation search with diagonal checks.
export function solveNQueens(n) {
  const results = [];
  const queens = []; // queens[r] = column

  function isSafe(r, c) {
    for (let pr = 0; pr < r; pr++) {
      const pc = queens[pr];
      if (pc === c) return false;
      if (Math.abs(pc - c) === Math.abs(pr - r)) return false;
    }
    return true;
  }

  function place(r) {
    if (r === n) {
      const board = [];
      for (let i = 0; i < n; i++) {
        const c = queens[i];
        board.push(".".repeat(c) + "Q" + ".".repeat(n - c - 1));
      }
      results.push(board);
      return;
    }
    for (let c = 0; c < n; c++) {
      if (isSafe(r, c)) {
        queens[r] = c;
        place(r + 1);
      }
    }
  }

  place(0);
  return results;
}
