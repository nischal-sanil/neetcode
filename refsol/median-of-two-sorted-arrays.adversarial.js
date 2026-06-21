// Independent reference: binary-search partition (O(log(min(m,n)))).
// Different algorithm from the author's merge-and-sort.
export function findMedianSortedArrays(nums1, nums2) {
  // Ensure nums1 is the shorter array.
  let A = nums1;
  let B = nums2;
  if (A.length > B.length) {
    [A, B] = [B, A];
  }
  const m = A.length;
  const n = B.length;
  const total = m + n;
  const half = Math.floor((total + 1) / 2);

  let lo = 0;
  let hi = m;
  while (lo <= hi) {
    const i = Math.floor((lo + hi) / 2); // elements taken from A
    const j = half - i; // elements taken from B

    const aLeft = i > 0 ? A[i - 1] : -Infinity;
    const aRight = i < m ? A[i] : Infinity;
    const bLeft = j > 0 ? B[j - 1] : -Infinity;
    const bRight = j < n ? B[j] : Infinity;

    if (aLeft <= bRight && bLeft <= aRight) {
      // Correct partition found.
      if (total % 2 === 1) {
        return Math.max(aLeft, bLeft);
      }
      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    } else if (aLeft > bRight) {
      hi = i - 1;
    } else {
      lo = i + 1;
    }
  }
  return 0; // unreachable for valid input
}
