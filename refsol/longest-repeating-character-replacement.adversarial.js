// Independent brute-force reference (O(n^2 * 26)): for every substring,
// check if it can be made uniform within k replacements.
export function characterReplacement(s, k) {
  const n = s.length;
  let best = 0;
  for (let i = 0; i < n; i++) {
    const count = {};
    let maxFreq = 0;
    for (let j = i; j < n; j++) {
      const c = s[j];
      count[c] = (count[c] || 0) + 1;
      if (count[c] > maxFreq) maxFreq = count[c];
      const windowLen = j - i + 1;
      if (windowLen - maxFreq <= k) {
        if (windowLen > best) best = windowLen;
      }
    }
  }
  return best;
}
