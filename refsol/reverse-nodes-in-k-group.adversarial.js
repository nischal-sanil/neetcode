// Independent approach: dump all node values into an array, reverse each full
// k-sized chunk in place within the array (leaving a trailing partial chunk
// untouched), then write the values back into the existing nodes in order.
// Differs from the author's dummy-node + pointer-rewiring method: no relinking,
// just value reassignment over the original node chain.
export function reverseKGroup(head, k) {
  const nodes = [];
  for (let cur = head; cur !== null; cur = cur.next) {
    nodes.push(cur);
  }

  const n = nodes.length;
  for (let start = 0; start + k <= n; start += k) {
    let lo = start;
    let hi = start + k - 1;
    while (lo < hi) {
      const tmp = nodes[lo].val;
      nodes[lo].val = nodes[hi].val;
      nodes[hi].val = tmp;
      lo++;
      hi--;
    }
  }

  return head;
}
