// Adversarial reference: DFS over an adjacency list (author used union-find).
export function countComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    adj[a].push(b);
    adj[b].push(a);
  }
  const visited = new Array(n).fill(false);
  let components = 0;
  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;
    components++;
    const stack = [start];
    visited[start] = true;
    while (stack.length) {
      const node = stack.pop();
      for (const next of adj[node]) {
        if (!visited[next]) {
          visited[next] = true;
          stack.push(next);
        }
      }
    }
  }
  return components;
}
