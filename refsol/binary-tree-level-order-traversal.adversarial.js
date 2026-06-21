// Adversarial reference: recursive DFS tracking depth (different from the
// author's iterative BFS). Each node appends its value to the row for its depth.
export function levelOrder(root) {
  const levels = [];
  const visit = (node, depth) => {
    if (!node) return;
    if (levels.length === depth) levels.push([]);
    levels[depth].push(node.val);
    visit(node.left, depth + 1);
    visit(node.right, depth + 1);
  };
  visit(root, 0);
  return levels;
}
