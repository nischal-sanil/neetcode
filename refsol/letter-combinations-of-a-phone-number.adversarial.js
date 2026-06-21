// Independent reference: recursive backtracking (vs author's iterative product).
export function letterCombinations(digits) {
  if (!digits || digits.length === 0) return [];
  const map = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz",
  };
  const out = [];
  function backtrack(i, path) {
    if (i === digits.length) {
      out.push(path);
      return;
    }
    const letters = map[digits[i]];
    for (const ch of letters) {
      backtrack(i + 1, path + ch);
    }
  }
  backtrack(0, "");
  return out;
}
