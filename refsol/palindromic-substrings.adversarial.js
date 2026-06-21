// Independent approach: dynamic programming over substrings.
// dp[i][j] is true iff s[i..j] is a palindrome.
export function countSubstrings(s) {
  const n = s.length;
  if (n === 0) return 0;
  const dp = Array.from({ length: n }, () => new Array(n).fill(false));
  let count = 0;
  // len is the substring length, from 1 to n.
  for (let len = 1; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] !== s[j]) {
        dp[i][j] = false;
      } else if (len <= 2) {
        dp[i][j] = true;
      } else {
        dp[i][j] = dp[i + 1][j - 1];
      }
      if (dp[i][j]) count++;
    }
  }
  return count;
}
