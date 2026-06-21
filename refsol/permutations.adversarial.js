// Independent approach: iterative insertion.
// Build permutations by inserting each number into every position of the
// permutations built so far. Different algorithm from the author's recursive
// backtracking-with-remaining-list approach.
export function permute(nums) {
  let result = [[]];
  for (const n of nums) {
    const next = [];
    for (const perm of result) {
      for (let i = 0; i <= perm.length; i++) {
        next.push([...perm.slice(0, i), n, ...perm.slice(i)]);
      }
    }
    result = next;
  }
  return result;
}
