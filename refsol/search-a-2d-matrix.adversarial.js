// Adversarial reference: staircase search from the top-right corner.
// Different approach from the author's single flattened binary search.
export function searchMatrix(matrix, target) {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) return false;
  const rows = matrix.length;
  const cols = matrix[0].length;
  let r = 0;
  let c = cols - 1;
  while (r < rows && c >= 0) {
    const val = matrix[r][c];
    if (val === target) return true;
    if (val > target) {
      c -= 1;
    } else {
      r += 1;
    }
  }
  return false;
}
