// Adversarial reference: generic binary-tree LCA via recursive DFS.
// Deliberately ignores the BST ordering property and instead recurses the
// whole tree, returning the node where p and q split into different subtrees.
// p and q are node values; return the LCA node.
export function lowestCommonAncestor(root, p, q) {
  if (!root) return null;
  if (root.val === p || root.val === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}
