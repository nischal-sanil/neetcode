// Adversarial reference: DFS-based cycle detection (white/gray/black coloring).
// Different approach from the author's Kahn's BFS indegree algorithm.
export function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
  }

  // 0 = unvisited, 1 = in current DFS stack, 2 = fully processed
  const state = new Array(numCourses).fill(0);

  function hasCycle(node) {
    if (state[node] === 1) return true;
    if (state[node] === 2) return false;
    state[node] = 1;
    for (const next of adj[node]) {
      if (hasCycle(next)) return true;
    }
    state[node] = 2;
    return false;
  }

  for (let c = 0; c < numCourses; c++) {
    if (hasCycle(c)) return false;
  }
  return true;
}
