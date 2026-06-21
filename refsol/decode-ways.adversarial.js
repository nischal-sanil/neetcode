// Independent approach: top-down recursion with memoization.
// Recurse from index i: count ways to decode s[i:].
export function numDecodings(s) {
  const n = s.length;
  const memo = new Map();

  function go(i) {
    if (i === n) return 1; // reached the end successfully
    if (s[i] === "0") return 0; // leading zero on a chunk: dead end
    if (memo.has(i)) return memo.get(i);

    // Take one digit (always valid since s[i] != '0' here).
    let ways = go(i + 1);

    // Take two digits if they form a valid letter 10..26.
    if (i + 1 < n) {
      const two = Number(s[i] + s[i + 1]);
      if (two >= 10 && two <= 26) {
        ways += go(i + 2);
      }
    }

    memo.set(i, ways);
    return ways;
  }

  return go(0);
}
