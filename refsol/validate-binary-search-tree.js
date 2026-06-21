export function isValidBST(root) {
  function valid(node, lo, hi) {
    if (!node) return true;
    if (!(lo < node.val && node.val < hi)) return false;
    return valid(node.left, lo, node.val) && valid(node.right, node.val, hi);
  }
  return valid(root, -Infinity, Infinity);
}
