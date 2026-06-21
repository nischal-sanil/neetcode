// Independent approach: fix one index, use a hash set for the inner two-sum.
// Dedup triplets via a canonical sorted-key set. Different from the author's
// sorted two-pointer scan.
export function threeSum(nums) {
  const n = nums.length;
  const seenTriplets = new Set();
  const res = [];
  for (let i = 0; i < n; i++) {
    const need = -nums[i];
    const seen = new Set();
    for (let j = i + 1; j < n; j++) {
      const complement = need - nums[j];
      if (seen.has(complement)) {
        const triplet = [nums[i], complement, nums[j]].sort((a, b) => a - b);
        const key = triplet.join(",");
        if (!seenTriplets.has(key)) {
          seenTriplets.add(key);
          res.push(triplet);
        }
      }
      seen.add(nums[j]);
    }
  }
  return res;
}
