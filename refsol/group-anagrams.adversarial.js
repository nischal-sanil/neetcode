// Independent approach: bucket by 26-length character-count signature
// (no sorting of the string), distinct from the author's sorted-key method.
export function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const counts = new Array(26).fill(0);
    for (const ch of s) {
      counts[ch.charCodeAt(0) - 97]++;
    }
    const key = counts.join("#");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return Array.from(groups.values());
}
