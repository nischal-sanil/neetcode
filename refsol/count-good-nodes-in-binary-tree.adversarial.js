// Iterative DFS using an explicit stack, tracking the max value on the path
// from the root to each node. Different approach than the recursive author ref.
export function goodNodes(root) {
  if (!root) return 0;
  let count = 0;
  const stack = [[root, -Infinity]];
  while (stack.length > 0) {
    const [node, maxSoFar] = stack.pop();
    if (node.val >= maxSoFar) count += 1;
    const newMax = Math.max(maxSoFar, node.val);
    if (node.left) stack.push([node.left, newMax]);
    if (node.right) stack.push([node.right, newMax]);
  }
  return count;
}
