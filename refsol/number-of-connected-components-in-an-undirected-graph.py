def countComponents(n, edges):
    parent = list(range(n))
    rank = [1] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return False
        if rank[ra] < rank[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        rank[ra] += rank[rb]
        return True

    components = n
    for a, b in edges:
        if union(a, b):
            components -= 1
    return components
