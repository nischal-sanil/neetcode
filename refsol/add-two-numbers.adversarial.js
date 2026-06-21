// Independent approach: decode each reversed-digit list into a BigInt,
// add them, then re-emit the sum as a reversed-digit linked list.
// (Author uses an iterative dummy-node carry walk; this uses arbitrary-
// precision integer arithmetic instead.)
export function addTwoNumbers(l1, l2) {
  const toBig = (node) => {
    let place = 1n;
    let total = 0n;
    for (let n = node; n !== null; n = n.next) {
      total += BigInt(n.val) * place;
      place *= 10n;
    }
    return total;
  };

  let sum = toBig(l1) + toBig(l2);

  // Build reversed-digit list. A zero sum still yields a single [0] node.
  let head = null;
  let tail = null;
  do {
    const digit = Number(sum % 10n);
    const node = { val: digit, next: null };
    if (tail === null) {
      head = node;
      tail = node;
    } else {
      tail.next = node;
      tail = node;
    }
    sum /= 10n;
  } while (sum > 0n);

  return head;
}
