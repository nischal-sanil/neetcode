// Independent approach: top-down recursion with memoization (vs. existing bottom-up 2D DP).
export function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const memo = new Map();

  function solve(i, j) {
    // i chars of word1 remaining from the front, j chars of word2.
    if (i === 0) return j; // insert remaining word2 chars
    if (j === 0) return i; // delete remaining word1 chars
    const key = i * (n + 1) + j;
    if (memo.has(key)) return memo.get(key);

    let result;
    if (word1[i - 1] === word2[j - 1]) {
      result = solve(i - 1, j - 1);
    } else {
      const replace = solve(i - 1, j - 1);
      const del = solve(i - 1, j);
      const insert = solve(i, j - 1);
      result = 1 + Math.min(replace, del, insert);
    }
    memo.set(key, result);
    return result;
  }

  return solve(m, n);
}
