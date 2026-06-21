// Adversarial reference: iterative BFS using a queue of node pairs,
// distinct from the author's recursive depth-first comparison.
export function isSameTree(p, q) {
  const queue = [[p, q]];
  while (queue.length > 0) {
    const [a, b] = queue.shift();
    if (a === null && b === null) continue;
    if (a === null || b === null) return false;
    if (a.val !== b.val) return false;
    queue.push([a.left, b.left]);
    queue.push([a.right, b.right]);
  }
  return true;
}
