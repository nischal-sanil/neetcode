// Independent approach: top-down memoized recursion over (i, j),
// counting distinct subsequences of s[i:] that equal t[j:].
export function numDistinct(s, t) {
  const m = s.length;
  const n = t.length;
  const memo = new Map();

  function count(i, j) {
    if (j === n) return 1; // matched all of t
    if (i === m) return 0; // exhausted s but t remains
    const key = i * (n + 1) + j;
    if (memo.has(key)) return memo.get(key);

    // Option 1: skip s[i]
    let total = count(i + 1, j);
    // Option 2: use s[i] to match t[j] if they're equal
    if (s[i] === t[j]) {
      total += count(i + 1, j + 1);
    }
    memo.set(key, total);
    return total;
  }

  return count(0, 0);
}
