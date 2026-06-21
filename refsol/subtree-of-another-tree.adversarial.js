// Adversarial approach: serialize each tree to a unique string using a
// preorder traversal with explicit null markers and value delimiters, then
// check whether subRoot's serialization is a substring of root's at a node
// boundary. Different from the author's recursive node-by-node comparison.

function serialize(node) {
  // Leading '^' marks the start of a node value so a substring match cannot
  // align on a partial number (e.g. "2" inside "12"). '#' marks null.
  if (!node) return "#";
  return "^" + node.val + "(" + serialize(node.left) + serialize(node.right) + ")";
}

export function isSubtree(root, subRoot) {
  if (!subRoot) return true;
  if (!root) return false;
  const big = serialize(root);
  const small = serialize(subRoot);
  return big.includes(small);
}
