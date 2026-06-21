// Independent approach: Kruskal's MST with Union-Find (disjoint set).
// (The existing python reference uses Prim's algorithm with a heap.)

export function minCostConnectPoints(points) {
  const n = points.length;
  if (n <= 1) return 0;

  // Build all candidate edges with Manhattan distance.
  const edges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const w = Math.abs(points[i][0] - points[j][0]) +
                Math.abs(points[i][1] - points[j][1]);
      edges.push([w, i, j]);
    }
  }
  edges.sort((a, b) => a[0] - b[0]);

  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // path compression
      x = parent[x];
    }
    return x;
  }

  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb]) {
      parent[ra] = rb;
    } else if (rank[ra] > rank[rb]) {
      parent[rb] = ra;
    } else {
      parent[rb] = ra;
      rank[ra]++;
    }
    return true;
  }

  let total = 0;
  let used = 0;
  for (const [w, i, j] of edges) {
    if (union(i, j)) {
      total += w;
      used++;
      if (used === n - 1) break;
    }
  }
  return total;
}
