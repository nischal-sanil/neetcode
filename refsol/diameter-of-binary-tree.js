export function diameterOfBinaryTree(root) {
  let best = 0;
  function depth(node) {
    if (!node) return 0;
    const left = depth(node.left);
    const right = depth(node.right);
    best = Math.max(best, left + right);
    return 1 + Math.max(left, right);
  }
  depth(root);
  return best;
}
