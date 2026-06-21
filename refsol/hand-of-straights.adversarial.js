// Independent approach: sort the cards, then for each remaining smallest card
// "open" a group of groupSize consecutive values, decrementing counts via a Map.
// No heap; we sweep the sorted unique keys and treat each leftover card as the
// start of a fresh straight.
export function isNStraightHand(hand, groupSize) {
  if (hand.length % groupSize !== 0) return false;

  const count = new Map();
  for (const card of hand) {
    count.set(card, (count.get(card) || 0) + 1);
  }

  const keys = [...count.keys()].sort((a, b) => a - b);

  for (const start of keys) {
    const need = count.get(start);
    if (need <= 0) continue; // already fully consumed by earlier groups
    // Build `need` straights all beginning at `start`.
    for (let v = start; v < start + groupSize; v++) {
      const have = count.get(v) || 0;
      if (have < need) return false;
      count.set(v, have - need);
    }
  }

  return true;
}
