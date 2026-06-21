// Bucket-sort approach: group numbers by frequency, then read buckets high->low.
export function topKFrequent(nums, k) {
  const counts = new Map();
  for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1);

  // buckets[freq] = list of numbers with that frequency
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of counts) buckets[freq].push(num);

  const result = [];
  for (let freq = buckets.length - 1; freq >= 0 && result.length < k; freq--) {
    for (const num of buckets[freq]) {
      result.push(num);
      if (result.length === k) break;
    }
  }
  return result;
}
