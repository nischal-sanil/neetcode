// Brute-force O(n^2): check every pair. Different approach from the
// author's two-pointer reference.
export function maxArea(height) {
  let best = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const area = Math.min(height[i], height[j]) * (j - i);
      if (area > best) best = area;
    }
  }
  return best;
}
