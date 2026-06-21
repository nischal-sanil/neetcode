// Adversarial reference: two-pass (count length, then index from front).
// Different approach than the author's single-pass two-pointer.
export function removeNthFromEnd(head, n) {
  let length = 0;
  for (let cur = head; cur !== null; cur = cur.next) length++;

  const target = length - n; // 0-based index of the node to remove
  if (target === 0) return head.next; // removing the head

  let prev = head;
  for (let i = 0; i < target - 1; i++) prev = prev.next;
  prev.next = prev.next.next;
  return head;
}
