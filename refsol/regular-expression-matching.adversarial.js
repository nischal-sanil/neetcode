// Independent approach: top-down recursion with memoization.
// Differs from the existing bottom-up DP (refsol/regular-expression-matching.py).
export function isMatch(s, p) {
  const memo = new Map();

  function match(i, j) {
    if (j === p.length) return i === s.length;

    const key = i * (p.length + 1) + j;
    if (memo.has(key)) return memo.get(key);

    const firstMatch = i < s.length && (p[j] === s[i] || p[j] === ".");

    let result;
    if (j + 1 < p.length && p[j + 1] === "*") {
      // zero occurrences (skip "x*") OR one+ occurrence (consume s[i], stay on pattern)
      result = match(i, j + 2) || (firstMatch && match(i + 1, j));
    } else {
      result = firstMatch && match(i + 1, j + 1);
    }

    memo.set(key, result);
    return result;
  }

  return match(0, 0);
}
