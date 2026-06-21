// Adversarial reference: bucket words by length and linear-scan with
// character-by-character matching ('.' is a wildcard). Different approach
// from the author's trie/DFS.
export class WordDictionary {
  constructor() {
    this.byLength = new Map();
  }

  addWord(word) {
    const n = word.length;
    if (!this.byLength.has(n)) this.byLength.set(n, []);
    this.byLength.get(n).push(word);
  }

  search(word) {
    const n = word.length;
    const candidates = this.byLength.get(n);
    if (!candidates) return false;
    for (const cand of candidates) {
      let ok = true;
      for (let i = 0; i < n; i++) {
        if (word[i] !== "." && word[i] !== cand[i]) {
          ok = false;
          break;
        }
      }
      if (ok) return true;
    }
    return false;
  }
}
