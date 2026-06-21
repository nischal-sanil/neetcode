// Independent approach: top-down recursion with memoization on (i, j).
export function isInterleave(s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;
  const memo = new Map();

  function rec(i, j) {
    if (i === s1.length && j === s2.length) return true;
    const key = i * (s2.length + 1) + j;
    if (memo.has(key)) return memo.get(key);

    const k = i + j;
    let result = false;
    if (i < s1.length && s1[i] === s3[k] && rec(i + 1, j)) {
      result = true;
    } else if (j < s2.length && s2[j] === s3[k] && rec(i, j + 1)) {
      result = true;
    }

    memo.set(key, result);
    return result;
  }

  return rec(0, 0);
}
