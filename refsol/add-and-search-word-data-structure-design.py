class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True

    def search(self, word):
        def dfs(node, i):
            if i == len(word):
                return "$" in node
            ch = word[i]
            if ch == ".":
                return any(
                    key != "$" and dfs(child, i + 1)
                    for key, child in node.items()
                )
            if ch in node:
                return dfs(node[ch], i + 1)
            return False

        return dfs(self.root, 0)
