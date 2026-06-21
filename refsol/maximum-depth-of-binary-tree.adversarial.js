// Iterative BFS (level-order) depth count — different approach from the recursive author ref.
export function maxDepth(root) {
  if (!root) return 0;
  let depth = 0;
  let queue = [root];
  while (queue.length > 0) {
    depth++;
    const next = [];
    for (const node of queue) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
  }
  return depth;
}
