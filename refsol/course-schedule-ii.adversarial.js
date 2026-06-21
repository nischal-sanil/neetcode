// Adversarial reference: DFS-based topological sort (post-order + reverse).
// The author used Kahn's BFS; this uses recursive DFS with cycle detection.
export function findOrder(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
  }

  // 0 = unvisited, 1 = in current stack, 2 = done
  const state = new Array(numCourses).fill(0);
  const postOrder = [];
  let hasCycle = false;

  function dfs(node) {
    state[node] = 1;
    for (const nxt of adj[node]) {
      if (state[nxt] === 1) {
        hasCycle = true;
        return;
      }
      if (state[nxt] === 0) {
        dfs(nxt);
        if (hasCycle) return;
      }
    }
    state[node] = 2;
    postOrder.push(node);
  }

  for (let i = 0; i < numCourses; i++) {
    if (state[i] === 0) {
      dfs(i);
      if (hasCycle) return [];
    }
  }

  return postOrder.reverse();
}
