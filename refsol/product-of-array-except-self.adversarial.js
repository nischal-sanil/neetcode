// Independent approach: count zeros and multiply non-zeros.
// - If 2+ zeros, every output is 0.
// - If exactly 1 zero, only the zero position gets the product of non-zeros; rest 0.
// - If no zeros, output[i] = totalProduct / nums[i].
export function productExceptSelf(nums) {
  const n = nums.length;
  let zeroCount = 0;
  let productNonZero = 1;
  for (const x of nums) {
    if (x === 0) zeroCount++;
    else productNonZero *= x;
  }

  const result = new Array(n).fill(0);
  if (zeroCount >= 2) {
    return result;
  }
  if (zeroCount === 1) {
    for (let i = 0; i < n; i++) {
      result[i] = nums[i] === 0 ? productNonZero : 0;
    }
    return result;
  }
  for (let i = 0; i < n; i++) {
    result[i] = productNonZero / nums[i];
  }
  return result;
}
