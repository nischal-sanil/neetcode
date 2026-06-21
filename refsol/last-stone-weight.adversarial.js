// Independent reference: repeatedly sort ascending and smash the two largest.
// Different approach from the author's heap-based solution.
export function lastStoneWeight(stones) {
  const s = [...stones];
  while (s.length > 1) {
    s.sort((a, b) => a - b);
    const first = s.pop();   // largest
    const second = s.pop();  // second largest
    if (first !== second) {
      s.push(first - second);
    }
  }
  return s.length ? s[0] : 0;
}
