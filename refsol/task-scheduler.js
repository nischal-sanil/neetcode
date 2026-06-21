export function leastInterval(tasks, n) {
  const counts = {};
  for (const t of tasks) counts[t] = (counts[t] || 0) + 1;
  const values = Object.values(counts);
  const maxCount = Math.max(...values);
  const numMax = values.filter((c) => c === maxCount).length;
  const slots = (maxCount - 1) * (n + 1) + numMax;
  return Math.max(slots, tasks.length);
}
