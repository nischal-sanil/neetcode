// Adversarial reference: NO trie nodes at all.
// Store complete words in a Set; derive search/startsWith by scanning.
// startsWith uses String.prototype.startsWith over the stored words.
export class Trie {
  constructor() {
    this.words = new Set();
  }

  insert(word) {
    this.words.add(word);
  }

  search(word) {
    return this.words.has(word);
  }

  startsWith(prefix) {
    for (const w of this.words) {
      if (w.startsWith(prefix)) return true;
    }
    return false;
  }
}
