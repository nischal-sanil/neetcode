export function validTree(n, edges) {
  // Independent approach: DFS connectivity + edge-count check.
  if (edges.length !== n - 1) return false;
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    adj[a].push(b);
    adj[b].push(a);
  }
  const seen = new Set();
  const stack = [0];
  while (stack.length) {
    const node = stack.pop();
    if (seen.has(node)) continue;
    seen.add(node);
    for (const nb of adj[node]) {
      if (!seen.has(nb)) stack.push(nb);
    }
  }
  return seen.size === n;
}
