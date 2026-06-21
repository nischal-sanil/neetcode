def cloneGraph(node):
    if node is None:
        return None
    mp = {}

    def dfs(n):
        if id(n) in mp:
            return mp[id(n)]
        copy = Node(n.val)
        mp[id(n)] = copy
        for nb in n.neighbors:
            copy.neighbors.append(dfs(nb))
        return copy

    return dfs(node)
