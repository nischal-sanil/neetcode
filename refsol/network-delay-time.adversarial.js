// Independent reference using Bellman-Ford (edge relaxation),
// a different algorithm than the Dijkstra/heap-based python reference.
export function networkDelayTime(times, n, k) {
  const INF = Infinity;
  const dist = new Array(n + 1).fill(INF);
  dist[k] = 0;

  // Relax all edges n-1 times.
  for (let i = 0; i < n - 1; i++) {
    let updated = false;
    for (const [u, v, w] of times) {
      if (dist[u] !== INF && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        updated = true;
      }
    }
    if (!updated) break;
  }

  let ans = 0;
  for (let node = 1; node <= n; node++) {
    if (dist[node] === INF) return -1;
    ans = Math.max(ans, dist[node]);
  }
  return ans;
}
