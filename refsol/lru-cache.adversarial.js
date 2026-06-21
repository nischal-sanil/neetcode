// Independent approach: manual doubly-linked list + hashmap.
// (Author uses Python's OrderedDict; this hand-rolls the recency list.)
class DNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    // head <-> ... <-> tail sentinels; head.next is LRU, tail.prev is MRU.
    this.head = new DNode(null, null);
    this.tail = new DNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addToBack(node) {
    const last = this.tail.prev;
    last.next = node;
    node.prev = last;
    node.next = this.tail;
    this.tail.prev = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._addToBack(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this._remove(node);
      this._addToBack(node);
      return;
    }
    const node = new DNode(key, value);
    this.map.set(key, node);
    this._addToBack(node);
    if (this.map.size > this.capacity) {
      const lru = this.head.next;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}
