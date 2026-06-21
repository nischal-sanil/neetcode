// Adversarial reference: divide-and-conquer pairwise merge (different from the
// author's min-heap approach). `lists` arrives as an array of value-arrays;
// build { val, next } ListNodes and return the merged head.

function buildList(vals) {
  let head = null;
  for (let i = vals.length - 1; i >= 0; i--) {
    head = { val: vals[i], next: head };
  }
  return head;
}

function mergeTwo(a, b) {
  const dummy = { val: 0, next: null };
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a || b;
  return dummy.next;
}

export function mergeKLists(lists) {
  let nodes = lists.map(buildList);
  if (nodes.length === 0) return null;
  while (nodes.length > 1) {
    const merged = [];
    for (let i = 0; i < nodes.length; i += 2) {
      const a = nodes[i];
      const b = i + 1 < nodes.length ? nodes[i + 1] : null;
      merged.push(mergeTwo(a, b));
    }
    nodes = merged;
  }
  return nodes[0];
}
