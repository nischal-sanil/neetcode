// Independent approach: XOR all indices [0..n] with all values.
// Pairs cancel, leaving the missing number.
export function missingNumber(nums) {
  let x = nums.length;
  for (let i = 0; i < nums.length; i++) {
    x ^= i ^ nums[i];
  }
  return x;
}
