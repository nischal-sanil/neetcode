// Independent reference: top-down recursive memoization on (i, j) suffixes.
// Different approach from the existing bottom-up 2D DP python reference.
export function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const memo = new Map();

  function lcs(i, j) {
    if (i === m || j === n) return 0;
    const key = i * (n + 1) + j;
    if (memo.has(key)) return memo.get(key);
    let result;
    if (text1[i] === text2[j]) {
      result = 1 + lcs(i + 1, j + 1);
    } else {
      result = Math.max(lcs(i + 1, j), lcs(i, j + 1));
    }
    memo.set(key, result);
    return result;
  }

  return lcs(0, 0);
}
