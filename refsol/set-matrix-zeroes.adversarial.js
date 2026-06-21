// Independent approach: O(1) extra space, using the first row and first
// column themselves as markers (instead of separate row/col sets).
export function setZeroes(matrix) {
  const m = matrix.length;
  if (m === 0) return;
  const n = matrix[0].length;

  let firstRowZero = false;
  let firstColZero = false;

  // Does the first row contain a zero?
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowZero = true;
      break;
    }
  }
  // Does the first column contain a zero?
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColZero = true;
      break;
    }
  }

  // Use first row/col as markers for the rest of the matrix.
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  // Zero out cells based on markers.
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // Handle first row and first column.
  if (firstRowZero) {
    for (let j = 0; j < n; j++) matrix[0][j] = 0;
  }
  if (firstColZero) {
    for (let i = 0; i < m; i++) matrix[i][0] = 0;
  }
}
