// Independent approach: visited-set detection. The author's reference uses
// Floyd's tortoise-and-hare (two pointers at different speeds). This instead
// walks the list once, recording each node object in a Set; a cycle exists iff
// we revisit a node before reaching the null terminator.
export function hasCycle(head) {
  const seen = new Set();
  let cur = head;
  while (cur !== null) {
    if (seen.has(cur)) {
      return true;
    }
    seen.add(cur);
    cur = cur.next;
  }
  return false;
}
