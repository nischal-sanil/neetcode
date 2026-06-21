// Independent approach: Floyd's cycle detection (tortoise & hare),
// no auxiliary set. Different algorithm than the hash-set reference.
function squareDigits(n) {
  let total = 0;
  while (n > 0) {
    const d = n % 10;
    total += d * d;
    n = Math.floor(n / 10);
  }
  return total;
}

export function isHappy(n) {
  let slow = n;
  let fast = squareDigits(n);
  while (fast !== 1 && slow !== fast) {
    slow = squareDigits(slow);
    fast = squareDigits(squareDigits(fast));
  }
  return fast === 1;
}
