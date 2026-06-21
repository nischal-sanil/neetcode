// Independent approach: backward DP over (day, canBuy) with memoization.
// dp(i, canBuy) = best profit achievable starting at day i.
// When buying, we move to i+1 still in a transaction; when selling we
// jump to i+2 to enforce the one-day cooldown. This is structurally
// different from the existing forward hold/sold/rest state machine.
export function maxProfit(prices) {
  const n = prices.length;
  const memo = new Map();

  function dp(i, canBuy) {
    if (i >= n) return 0;
    const key = i * 2 + (canBuy ? 1 : 0);
    if (memo.has(key)) return memo.get(key);

    // Option 1: do nothing today, defer to the next day.
    let best = dp(i + 1, canBuy);

    if (canBuy) {
      // Buy today: spend prices[i], continue holding from tomorrow.
      best = Math.max(best, dp(i + 1, false) - prices[i]);
    } else {
      // Sell today: gain prices[i], then cooldown skips day i+1.
      best = Math.max(best, dp(i + 2, true) + prices[i]);
    }

    memo.set(key, best);
    return best;
  }

  return dp(0, true);
}
