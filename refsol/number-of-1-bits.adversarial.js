// Independent reference: count set bits by repeated division by 2,
// inspecting the remainder (LSB) each step. Different algorithm from the
// Brian Kernighan (n &= n-1) approach in the python ref.
// Uses BigInt to stay correct for values above the 32-bit signed range,
// where JS bitwise operators would otherwise misbehave.
export function hammingWeight(n) {
  let x = BigInt(n);
  let count = 0;
  while (x > 0n) {
    if (x % 2n === 1n) count += 1;
    x /= 2n;
  }
  return count;
}
