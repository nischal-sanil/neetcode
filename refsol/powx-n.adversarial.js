// Independent reference: recursive divide-and-conquer fast exponentiation.
// Different approach from the iterative bit-shift reference in powx-n.py.
export function myPow(x, n) {
  if (n < 0) {
    return 1 / pow(x, -n);
  }
  return pow(x, n);
}

function pow(x, n) {
  if (n === 0) {
    return 1.0;
  }
  const half = pow(x, Math.floor(n / 2));
  if (n % 2 === 0) {
    return half * half;
  }
  return half * half * x;
}
