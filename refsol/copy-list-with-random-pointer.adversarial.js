// Independent adversarial reference: O(1)-space interleaving (node-weaving)
// approach, distinct from the author's hash-map mapping.
//
// Step 1: insert each cloned node directly after its original:
//   A -> A' -> B -> B' -> C -> C' ...
// Step 2: wire clones' random pointers via orig.next (the clone).
// Step 3: unweave the two lists, restoring the original.
export function copyRandomList(head) {
  if (head === null || head === undefined) return null;

  // Interleave clones into the original list.
  let cur = head;
  while (cur !== null) {
    const clone = { val: cur.val, next: cur.next, random: null };
    cur.next = clone;
    cur = clone.next;
  }

  // Assign random pointers on the clones.
  cur = head;
  while (cur !== null) {
    const clone = cur.next;
    clone.random = cur.random !== null ? cur.random.next : null;
    cur = clone.next;
  }

  // Separate the interleaved lists, restoring the original.
  const newHead = head.next;
  cur = head;
  while (cur !== null) {
    const clone = cur.next;
    cur.next = clone.next;
    clone.next = clone.next !== null ? clone.next.next : null;
    cur = cur.next;
  }

  return newHead;
}
