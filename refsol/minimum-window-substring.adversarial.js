// Independent approach: sliding window using a "required distinct chars" /
// "formed distinct chars" counter (vs. the author's single-`missing` counter).
// Tie-breaking matches the author: returns the LEFTMOST window of minimum
// length, because we record a new best only on a strictly smaller window while
// scanning left to right.
export function minWindow(s, t) {
  if (t.length === 0 || s.length === 0) return "";

  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
  const required = need.size;

  const have = new Map();
  let formed = 0;
  let left = 0;
  let bestLen = Infinity;
  let bestStart = -1;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    have.set(c, (have.get(c) || 0) + 1);
    if (need.has(c) && have.get(c) === need.get(c)) formed++;

    while (formed === required) {
      const winLen = right - left + 1;
      if (winLen < bestLen) {
        bestLen = winLen;
        bestStart = left;
      }
      const lc = s[left];
      have.set(lc, have.get(lc) - 1);
      if (need.has(lc) && have.get(lc) < need.get(lc)) formed--;
      left++;
    }
  }

  return bestStart === -1 ? "" : s.slice(bestStart, bestStart + bestLen);
}
