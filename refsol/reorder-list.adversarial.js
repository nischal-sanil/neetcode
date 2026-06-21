// Independent approach: collect all nodes into an array, then re-link by
// interleaving from both ends inward (front, back, front+1, back-1, ...).
// Differs from the author's find-middle / reverse-second-half / merge method.
export function reorderList(head) {
  if (head === null || head.next === null) return;

  const nodes = [];
  for (let cur = head; cur !== null; cur = cur.next) {
    nodes.push(cur);
  }

  let lo = 0;
  let hi = nodes.length - 1;
  let prev = null;
  while (lo < hi) {
    if (prev !== null) prev.next = nodes[lo];
    nodes[lo].next = nodes[hi];
    prev = nodes[hi];
    lo++;
    hi--;
  }
  // lo === hi (odd length) -> middle node is the tail;
  // lo > hi (even length) -> prev is the tail.
  if (lo === hi) {
    prev.next = nodes[lo];
    nodes[lo].next = null;
  } else {
    prev.next = null;
  }
}
