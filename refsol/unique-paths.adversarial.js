// Independent approach: closed-form combinatorics.
// Number of paths = C(m+n-2, m-1), computed multiplicatively to avoid overflow.
export function uniquePaths(m, n) {
  const total = m + n - 2;
  const k = Math.min(m - 1, n - 1);
  let result = 1;
  for (let i = 1; i <= k; i++) {
    // result *= (total - k + i) / i, kept integral at each step
    result = (result * (total - k + i)) / i;
  }
  return Math.round(result);
}
