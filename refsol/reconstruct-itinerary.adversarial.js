// Independent reference: lexicographic backtracking DFS.
// Different algorithm from the Hierholzer (Eulerian path) reference.
// We must use ALL tickets exactly once, forming a valid itinerary from JFK.
// Try destinations in lexicographic order; the first complete itinerary
// found this way is the lexicographically smallest valid one.
export function findItinerary(tickets) {
  const total = tickets.length;

  // adjacency: src -> sorted list of [dst, used]
  const adj = new Map();
  for (const [src, dst] of tickets) {
    if (!adj.has(src)) adj.set(src, []);
    adj.get(src).push(dst);
  }
  for (const list of adj.values()) list.sort();

  const route = ["JFK"];
  const used = new Map(); // src -> array<boolean> aligned with adj list

  function backtrack(node) {
    if (route.length === total + 1) return true;
    const dests = adj.get(node);
    if (!dests) return false;
    if (!used.has(node)) used.set(node, new Array(dests.length).fill(false));
    const flags = used.get(node);
    for (let i = 0; i < dests.length; i++) {
      if (flags[i]) continue;
      // skip duplicate destinations already tried at this position to avoid
      // redundant branches (same string => same subtree)
      if (i > 0 && dests[i] === dests[i - 1] && !flags[i - 1]) continue;
      flags[i] = true;
      route.push(dests[i]);
      if (backtrack(dests[i])) return true;
      route.pop();
      flags[i] = false;
    }
    return false;
  }

  backtrack("JFK");
  return route;
}
