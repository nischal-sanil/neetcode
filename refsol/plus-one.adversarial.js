// Independent approach: build the integer value with BigInt, add one,
// then decompose back into digits. No per-digit carry loop.
export function plusOne(digits) {
  let value = 0n;
  for (const d of digits) {
    value = value * 10n + BigInt(d);
  }
  value += 1n;

  const result = [];
  while (value > 0n) {
    result.unshift(Number(value % 10n));
    value /= 10n;
  }
  // value of 0 would never happen here (we added 1), but guard anyway
  return result.length ? result : [0];
}
