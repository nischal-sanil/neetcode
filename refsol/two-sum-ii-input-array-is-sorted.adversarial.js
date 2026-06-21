// Independent approach: for each left index, binary-search for the complement
// to its right. Different from the author's two-pointer scan.
export function twoSum(numbers, target) {
  const n = numbers.length;
  for (let i = 0; i < n; i++) {
    const need = target - numbers[i];
    let lo = i + 1, hi = n - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (numbers[mid] === need) {
        return [i + 1, mid + 1];
      } else if (numbers[mid] < need) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
  }
  return [];
}
