// TreeNode shape: { val, left, right }
// Independent approach: iterative O(n) construction using a stack
// (Leetcode's stack-based method, different from the recursive index-map approach).
export function buildTree(preorder, inorder) {
  if (preorder.length === 0) return null;

  const root = { val: preorder[0], left: null, right: null };
  const stack = [root];
  let inorderIdx = 0;

  for (let i = 1; i < preorder.length; i++) {
    const node = { val: preorder[i], left: null, right: null };
    let top = stack[stack.length - 1];

    if (top.val !== inorder[inorderIdx]) {
      // Still going left
      top.left = node;
      stack.push(node);
    } else {
      // Climb up while tops match the inorder sequence, then attach as right child
      while (stack.length > 0 && stack[stack.length - 1].val === inorder[inorderIdx]) {
        top = stack.pop();
        inorderIdx++;
      }
      top.right = node;
      stack.push(node);
    }
  }

  return root;
}
