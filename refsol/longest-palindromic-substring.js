export function longestPalindrome(s) {
  const n = s.length;
  if (n === 0) return "";
  let start = 0;
  let maxLen = 1;
  // dp[i][j] = whether s[i..j] is a palindrome
  const dp = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let i = 0; i < n; i++) dp[i][i] = true;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j] && (len === 2 || dp[i + 1][j - 1])) {
        dp[i][j] = true;
        if (len > maxLen) {
          maxLen = len;
          start = i;
        }
      }
    }
  }
  return s.substring(start, start + maxLen);
}
