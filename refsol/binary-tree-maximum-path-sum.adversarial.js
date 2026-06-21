// Independent approach: collect every node's "downward best path sum" via
// post-order, store in a map, then in a second pass compute, for each node,
// val + max(leftDown,0) + max(rightDown,0) as a candidate full path through it.
// Take the global max over all candidates. Different structure from the
// author's single-pass closure-over-best version.

function maxPathSum(root) {
  if (root === null) return 0;

  const down = new Map(); // node -> best downward path sum starting at node

  // iterative post-order to fill `down`
  const order = [];
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    order.push(n);
    if (n.left) stack.push(n.left);
    if (n.right) stack.push(n.right);
  }
  // process in reverse (children before parents)
  for (let i = order.length - 1; i >= 0; i--) {
    const n = order[i];
    const l = n.left ? Math.max(down.get(n.left), 0) : 0;
    const r = n.right ? Math.max(down.get(n.right), 0) : 0;
    down.set(n, n.val + Math.max(l, r));
  }

  let best = -Infinity;
  for (const n of order) {
    const l = n.left ? Math.max(down.get(n.left), 0) : 0;
    const r = n.right ? Math.max(down.get(n.right), 0) : 0;
    best = Math.max(best, n.val + l + r);
  }
  return best;
}

export { maxPathSum };
