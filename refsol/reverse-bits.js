export function reverseBits(n) {
  let result = 0n;
  let x = BigInt(n);
  for (let i = 0; i < 32; i++) {
    result = (result << 1n) | (x & 1n);
    x >>= 1n;
  }
  return Number(result);
}
