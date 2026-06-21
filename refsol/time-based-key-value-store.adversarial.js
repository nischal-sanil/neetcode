export class TimeMap {
  constructor() {
    // key -> array of [timestamp, value] appended in set order
    this.store = new Map();
  }

  set(key, value, timestamp) {
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }
    this.store.get(key).push([timestamp, value]);
  }

  get(key, timestamp) {
    const entries = this.store.get(key);
    if (!entries) return "";
    // Linear scan: pick the value with the largest timestamp that is <= query.
    let bestTs = -1;
    let bestVal = "";
    for (const [ts, val] of entries) {
      if (ts <= timestamp && ts >= bestTs) {
        bestTs = ts;
        bestVal = val;
      }
    }
    return bestVal;
  }
}
