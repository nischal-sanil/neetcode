// Independent approach: count set bits of each number directly via
// Brian Kernighan's algorithm (no DP recurrence on previous results).
export function countBits(n) {
  const ans = [];
  for (let i = 0; i <= n; i++) {
    let x = i;
    let count = 0;
    while (x !== 0) {
      x &= x - 1; // clear lowest set bit
      count++;
    }
    ans.push(count);
  }
  return ans;
}
