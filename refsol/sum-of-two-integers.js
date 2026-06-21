export function getSum(a, b) {
  // Add without + or -: XOR is sum-without-carry, AND<<1 is the carry.
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}
