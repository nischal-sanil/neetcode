// Independent approach: BFS shortest-path over reachable amounts.
// Each "level" of BFS adds one coin; the first time we reach `amount`
// the level count is the minimum number of coins.
export function coinChange(coins, amount) {
  if (amount === 0) return 0;
  const visited = new Array(amount + 1).fill(false);
  let frontier = [0];
  visited[0] = true;
  let level = 0;
  while (frontier.length > 0) {
    level += 1;
    const next = [];
    for (const cur of frontier) {
      for (const c of coins) {
        const nv = cur + c;
        if (nv === amount) return level;
        if (nv < amount && !visited[nv]) {
          visited[nv] = true;
          next.push(nv);
        }
      }
    }
    frontier = next;
  }
  return -1;
}
