// Independent reference: arithmetic digit-by-digit reversal (no string ops).
// Pop the last digit with %/Math.trunc and push onto the accumulator.
// Returns 0 if the reversed value falls outside the signed 32-bit range.
export function reverse(x) {
  const INT_MAX = 2147483647; // 2^31 - 1
  const INT_MIN = -2147483648; // -2^31

  let result = 0;
  let n = x;
  while (n !== 0) {
    const digit = n % 10; // keeps sign of n in JS
    n = Math.trunc(n / 10);
    result = result * 10 + digit;
  }

  if (result < INT_MIN || result > INT_MAX) {
    return 0;
  }
  return result;
}
