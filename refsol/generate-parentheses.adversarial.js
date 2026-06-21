// Divide-and-conquer using the Catalan recurrence:
// every valid string of n pairs is "(" + A + ")" + B where A has i pairs
// and B has n-1-i pairs, for i in 0..n-1. Different algorithm from the
// author's open/close-count backtracking.
export function generateParenthesis(n) {
  const memo = new Map();

  function build(k) {
    if (k === 0) return [""];
    if (memo.has(k)) return memo.get(k);
    const out = [];
    for (let i = 0; i < k; i++) {
      const inner = build(i);
      const rest = build(k - 1 - i);
      for (const a of inner) {
        for (const b of rest) {
          out.push("(" + a + ")" + b);
        }
      }
    }
    memo.set(k, out);
    return out;
  }

  return build(n);
}
