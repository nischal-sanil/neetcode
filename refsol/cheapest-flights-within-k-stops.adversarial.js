// Independent approach: Dijkstra-style best-first search over (cost, node, stopsUsed).
// Different from the bounded Bellman-Ford reference. We pop the cheapest frontier
// state and expand neighbors while stops remain, tracking the fewest stops seen at
// each node to prune dominated states.
export function findCheapestPrice(n, flights, src, dst, k) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of flights) {
    adj[u].push([v, w]);
  }

  // Min-heap by cost. Simple binary heap implementation.
  const heap = [[0, src, k + 1]]; // [cost, node, stopsRemaining (edges allowed)]
  const push = (item) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent][0] <= heap[i][0]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      const len = heap.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let smallest = i;
        if (l < len && heap[l][0] < heap[smallest][0]) smallest = l;
        if (r < len && heap[r][0] < heap[smallest][0]) smallest = r;
        if (smallest === i) break;
        [heap[smallest], heap[i]] = [heap[i], heap[smallest]];
        i = smallest;
      }
    }
    return top;
  };

  // Best (max) stopsRemaining reached at a node for a given cost frontier.
  const bestStops = new Array(n).fill(-1);

  while (heap.length > 0) {
    const [cost, node, stopsRemaining] = pop();
    if (node === dst) return cost;
    if (stopsRemaining <= 0) continue;
    // If we've already visited this node with at least as many edges remaining,
    // this state is dominated (we got here cheaper or equal earlier).
    if (stopsRemaining <= bestStops[node]) continue;
    bestStops[node] = stopsRemaining;
    for (const [next, w] of adj[node]) {
      push([cost + w, next, stopsRemaining - 1]);
    }
  }

  return -1;
}
