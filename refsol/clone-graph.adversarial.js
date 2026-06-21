// Independent approach: iterative BFS clone (existing python ref uses recursive DFS).
// Graph node shape provided by the harness: { val, neighbors }.
export function cloneGraph(node) {
  if (node === null || node === undefined) return null;

  const clones = new Map();
  clones.set(node, { val: node.val, neighbors: [] });

  const queue = [node];
  while (queue.length > 0) {
    const cur = queue.shift();
    const curClone = clones.get(cur);
    for (const nb of cur.neighbors) {
      if (!clones.has(nb)) {
        clones.set(nb, { val: nb.val, neighbors: [] });
        queue.push(nb);
      }
      curClone.neighbors.push(clones.get(nb));
    }
  }

  return clones.get(node);
}
