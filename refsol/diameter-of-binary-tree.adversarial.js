// Adversarial reference: compute height of each node independently, then take
// the max of (leftHeight + rightHeight) over all nodes. Different algorithm
// than the author's single-pass nonlocal-best DFS.

function height(node) {
  if (node === null || node === undefined) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

export function diameterOfBinaryTree(root) {
  let best = 0;
  const visit = (node) => {
    if (node === null || node === undefined) return;
    const through = height(node.left) + height(node.right);
    if (through > best) best = through;
    visit(node.left);
    visit(node.right);
  };
  visit(root);
  return best;
}
