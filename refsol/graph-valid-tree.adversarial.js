// Adversarial reference for graph-valid-tree.
// Different approach from the author's union-find: a graph on n nodes is a tree
// iff it has exactly n-1 edges AND is connected. We check the edge count, then
// run an iterative DFS from node 0 and confirm every node is reachable.
// (The n-1 edge count rules out cycles given connectivity, and also correctly
// rejects duplicate/multi-edges which a naive parent-tracking BFS would miss.)
export function validTree(n, edges) {
  if (n === 0) return true;
  if (edges.length !== n - 1) return false;

  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    adj[a].push(b);
    adj[b].push(a);
  }

  const visited = new Array(n).fill(false);
  const stack = [0];
  visited[0] = true;
  let seen = 1;

  while (stack.length > 0) {
    const node = stack.pop();
    for (const next of adj[node]) {
      if (!visited[next]) {
        visited[next] = true;
        seen++;
        stack.push(next);
      }
    }
  }

  return seen === n;
}
