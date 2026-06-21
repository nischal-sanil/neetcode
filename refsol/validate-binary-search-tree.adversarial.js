// Adversarial reference: in-order traversal must yield strictly increasing
// values. Different approach from the author's min/max bounds recursion.
export function isValidBST(root) {
  let prev = null;
  let ok = true;
  function inorder(node) {
    if (node === null || !ok) return;
    inorder(node.left);
    if (prev !== null && node.val <= prev) {
      ok = false;
      return;
    }
    prev = node.val;
    inorder(node.right);
  }
  inorder(root);
  return ok;
}
