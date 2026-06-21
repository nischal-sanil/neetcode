export function permute(nums) {
  const result = [];
  const n = nums.length;
  const used = new Array(n).fill(false);
  const current = [];

  function backtrack() {
    if (current.length === n) {
      result.push(current.slice());
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(nums[i]);
      backtrack();
      current.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}
