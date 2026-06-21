// Independent approach: top-down memoized recursion over (coinIndex, remaining).
// At each coin we branch: skip it, or use it (staying on same index to allow reuse).
// Different algorithm from the existing 1D bottom-up DP.
export function change(amount, coins) {
  const n = coins.length;
  const memo = new Map();

  function count(i, remaining) {
    if (remaining === 0) return 1;
    if (i >= n) return 0;
    const key = i * (amount + 1) + remaining;
    if (memo.has(key)) return memo.get(key);

    let total = count(i + 1, remaining); // skip coin i
    if (coins[i] <= remaining) {
      total += count(i, remaining - coins[i]); // use coin i, can reuse
    }
    memo.set(key, total);
    return total;
  }

  return count(0, amount);
}
