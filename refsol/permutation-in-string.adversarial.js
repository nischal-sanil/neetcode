// Independent approach: for each window of length |s1| in s2, compare
// sorted character arrays. Brute-force-ish, distinct from the author's
// rolling-count sliding window.
export function checkInclusion(s1, s2) {
  const n = s1.length;
  const m = s2.length;
  if (n > m) return false;

  const target = s1.split("").sort().join("");

  for (let i = 0; i + n <= m; i++) {
    const window = s2.slice(i, i + n).split("").sort().join("");
    if (window === target) return true;
  }
  return false;
}
