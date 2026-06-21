// Adversarial reference: scan right-to-left, track the maximum future
// selling price; profit at each day is (maxFuture - price). Different
// formulation than the author's left-to-right min-tracking greedy.
export function maxProfit(prices) {
  let best = 0;
  let maxFuture = -Infinity;
  for (let i = prices.length - 1; i >= 0; i--) {
    if (prices[i] > maxFuture) maxFuture = prices[i];
    const profit = maxFuture - prices[i];
    if (profit > best) best = profit;
  }
  return best;
}
