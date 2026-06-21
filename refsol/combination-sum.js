export function combinationSum(candidates, target) {
  const res = [];
  candidates.sort((a, b) => a - b);

  function backtrack(start, remaining, path) {
    if (remaining === 0) {
      res.push(path.slice());
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      const c = candidates[i];
      if (c > remaining) break;
      path.push(c);
      backtrack(i, remaining - c, path);
      path.pop();
    }
  }

  backtrack(0, target, []);
  return res;
}
