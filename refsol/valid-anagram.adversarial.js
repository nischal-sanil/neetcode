// Different approach: sort both strings and compare.
export function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const a = [...s].sort().join("");
  const b = [...t].sort().join("");
  return a === b;
}
