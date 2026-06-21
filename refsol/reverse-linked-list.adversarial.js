// Independent approach: recursive reversal. The author's reference walks the
// list iteratively with a prev/next pointer swap. This instead recurses to the
// tail, then rewires each node's successor to point back at it on the way up.
export function reverseList(head) {
  if (head === null || head.next === null) {
    return head;
  }
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
