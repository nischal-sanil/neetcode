export class WordDictionary {
  constructor() {
    this.root = {};
  }

  addWord(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node["$"] = true;
  }

  search(word) {
    const dfs = (node, i) => {
      if (i === word.length) return node["$"] === true;
      const ch = word[i];
      if (ch === ".") {
        for (const key of Object.keys(node)) {
          if (key !== "$" && dfs(node[key], i + 1)) return true;
        }
        return false;
      }
      if (node[ch]) return dfs(node[ch], i + 1);
      return false;
    };
    return dfs(this.root, 0);
  }
}
