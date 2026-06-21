// Different approach from the author's iterative in-order traversal:
// recursively flatten the BST into a sorted value array, then index k-1.
export function kthSmallest(root, k) {
  const vals = [];
  const inorder = (node) => {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  };
  inorder(root);
  return vals[k - 1];
}
