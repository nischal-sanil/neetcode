// Independent top-down approach: compute height() separately at every node
// and check |leftHeight - rightHeight| <= 1 for every node (O(n^2) but correct).
function height(node) {
  if (!node) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

export function isBalanced(root) {
  if (!root) return true;
  if (Math.abs(height(root.left) - height(root.right)) > 1) return false;
  return isBalanced(root.left) && isBalanced(root.right);
}
