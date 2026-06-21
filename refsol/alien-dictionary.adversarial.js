// Independent reference: DFS-based topological sort (post-order),
// distinct from the existing Kahn's-BFS Python reference.
//
// State per node: 0 = unvisited, 1 = in current DFS stack (gray),
// 2 = fully processed (black). Finding a gray node mid-DFS means a cycle.

export function alienOrder(words) {
  // Collect all distinct characters.
  const adj = new Map();
  for (const w of words) {
    for (const c of w) {
      if (!adj.has(c)) adj.set(c, new Set());
    }
  }

  // Build edges from each adjacent pair of words.
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i];
    const b = words[i + 1];
    const ln = Math.min(a.length, b.length);
    let differed = false;
    for (let j = 0; j < ln; j++) {
      if (a[j] !== b[j]) {
        adj.get(a[j]).add(b[j]);
        differed = true;
        break;
      }
    }
    // Prefix violation: a is longer but b is its prefix.
    if (!differed && a.length > b.length) return "";
  }

  const state = new Map();
  for (const c of adj.keys()) state.set(c, 0);
  const postorder = [];
  let cycle = false;

  // Iterative DFS to avoid recursion limits; emits post-order.
  function dfs(start) {
    const stack = [[start, false]];
    while (stack.length) {
      const frame = stack[stack.length - 1];
      const [node, processed] = frame;
      if (processed) {
        stack.pop();
        if (state.get(node) !== 2) {
          state.set(node, 2);
          postorder.push(node);
        }
        continue;
      }
      frame[1] = true;
      if (state.get(node) === 1) {
        cycle = true;
        return;
      }
      if (state.get(node) === 2) {
        stack.pop();
        continue;
      }
      state.set(node, 1);
      for (const nxt of adj.get(node)) {
        if (state.get(nxt) === 1) {
          cycle = true;
          return;
        }
        if (state.get(nxt) === 0) stack.push([nxt, false]);
      }
    }
  }

  for (const c of adj.keys()) {
    if (state.get(c) === 0) {
      dfs(c);
      if (cycle) return "";
    }
  }

  // Post-order gives reverse topological order; reverse it.
  postorder.reverse();
  return postorder.join("");
}
