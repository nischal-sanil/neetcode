// Independent approach: for each empty room, run a BFS from that room
// outward until it reaches the nearest gate (value 0), recording the
// shortest path length. This differs from the author's multi-source BFS
// that floods outward from all gates simultaneously.

const INF = 2147483647;

export function wallsAndGates(rooms) {
  if (!rooms || rooms.length === 0 || rooms[0].length === 0) return;
  const m = rooms.length;
  const n = rooms[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (let sr = 0; sr < m; sr++) {
    for (let sc = 0; sc < n; sc++) {
      if (rooms[sr][sc] !== INF) continue;
      // BFS from this empty room to the closest gate.
      const seen = Array.from({ length: m }, () => new Array(n).fill(false));
      seen[sr][sc] = true;
      let queue = [[sr, sc]];
      let dist = 0;
      let found = false;
      while (queue.length > 0 && !found) {
        dist++;
        const next = [];
        for (const [r, c] of queue) {
          for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
            if (seen[nr][nc]) continue;
            const v = rooms[nr][nc];
            if (v === -1) continue; // wall
            if (v === 0) {
              rooms[sr][sc] = dist;
              found = true;
              break;
            }
            // empty room (INF) or already-filled distance; treat as passable
            // by original emptiness: only INF cells are part of the open grid.
            // To keep the search on the original grid we only traverse cells
            // that were originally INF or are gates; filled distances came from
            // INF originally too, so traversing them is fine for connectivity.
            seen[nr][nc] = true;
            next.push([nr, nc]);
          }
          if (found) break;
        }
        queue = next;
      }
      // if no gate reachable, room stays INF
    }
  }
}
