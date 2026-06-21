// Independent reference: top-down memoized recursion (DFS), distinct from
// the bottom-up DP in word-break.py.
export function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const memo = new Map();

  function canBreak(start) {
    if (start === s.length) return true;
    if (memo.has(start)) return memo.get(start);

    let result = false;
    for (let end = start + 1; end <= s.length; end++) {
      if (words.has(s.slice(start, end)) && canBreak(end)) {
        result = true;
        break;
      }
    }
    memo.set(start, result);
    return result;
  }

  return canBreak(0);
}
