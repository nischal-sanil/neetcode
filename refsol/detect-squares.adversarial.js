// Independent approach: group stored points by their x-coordinate (column).
// For count(px, py): look at every other point (x2, y2) sharing the SAME
// column as the query (x2 === px, y2 !== py). That vertical pair fixes one
// side of length d = |py - y2|. A square can extend left or right, so the
// other two corners are at (px +/- d, py) and (px +/- d, y2). Multiply the
// counts of those corners. This anchors on the vertical side rather than the
// diagonal point, so it shares no structure with the reference solution.

export class DetectSquares {
  constructor() {
    this.byColumn = new Map(); // x -> Map(y -> count)
    this.count_ = new Map(); // "x,y" -> count
  }

  add(point) {
    const [x, y] = point;
    if (!this.byColumn.has(x)) this.byColumn.set(x, new Map());
    const col = this.byColumn.get(x);
    col.set(y, (col.get(y) || 0) + 1);

    const key = x + "," + y;
    this.count_.set(key, (this.count_.get(key) || 0) + 1);
  }

  cnt(x, y) {
    return this.count_.get(x + "," + y) || 0;
  }

  count(point) {
    const [px, py] = point;
    const col = this.byColumn.get(px);
    if (!col) return 0;

    let total = 0;
    for (const [y2, c2] of col) {
      if (y2 === py) continue;
      const d = Math.abs(py - y2);
      // extend to the right
      total += c2 * this.cnt(px + d, py) * this.cnt(px + d, y2);
      // extend to the left
      total += c2 * this.cnt(px - d, py) * this.cnt(px - d, y2);
    }
    return total;
  }
}
