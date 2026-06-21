// Adversarial reference: DP palindrome table + memoized partition-from-index.
// Different from the author's plain backtracking.
export function partition(s) {
  const n = s.length;

  // isPal[i][j] = true if s[i..j] inclusive is a palindrome.
  const isPal = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i < 2 || isPal[i + 1][j - 1])) {
        isPal[i][j] = true;
      }
    }
  }

  // memo[start] = list of all palindrome partitions of s[start..end].
  const memo = new Map();
  function solve(start) {
    if (start === n) return [[]];
    if (memo.has(start)) return memo.get(start);
    const out = [];
    for (let end = start; end < n; end++) {
      if (isPal[start][end]) {
        const prefix = s.slice(start, end + 1);
        for (const rest of solve(end + 1)) {
          out.push([prefix, ...rest]);
        }
      }
    }
    memo.set(start, out);
    return out;
  }

  return solve(0);
}
