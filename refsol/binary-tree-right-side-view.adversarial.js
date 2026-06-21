// Adversarial reference: DFS right-first preorder.
// The first node visited at each depth (going right before left) is the
// rightmost node of that level. Different approach than the author's BFS.
export function rightSideView(root) {
  const result = [];
  function dfs(node, depth) {
    if (node === null) return;
    if (depth === result.length) {
      result.push(node.val);
    }
    dfs(node.right, depth + 1);
    dfs(node.left, depth + 1);
  }
  dfs(root, 0);
  return result;
}
