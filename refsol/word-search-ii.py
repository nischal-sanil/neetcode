def findWords(board, words):
    if not board or not board[0]:
        return []

    trie = {}
    for w in words:
        node = trie
        for ch in w:
            node = node.setdefault(ch, {})
        node["#"] = w

    rows, cols = len(board), len(board[0])
    found = []

    def dfs(r, c, node):
        ch = board[r][c]
        nxt = node.get(ch)
        if nxt is None:
            return
        word = nxt.get("#")
        if word is not None:
            found.append(word)
            del nxt["#"]
        board[r][c] = "*"
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "*":
                dfs(nr, nc, nxt)
        board[r][c] = ch

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, trie)

    return found
