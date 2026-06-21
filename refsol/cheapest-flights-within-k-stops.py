def findCheapestPrice(n, flights, src, dst, k):
    INF = float("inf")
    dist = [INF] * n
    dist[src] = 0
    # at most k stops => k+1 edges (Bellman-Ford bounded relaxations)
    for _ in range(k + 1):
        tmp = dist[:]
        for u, v, w in flights:
            if dist[u] != INF and dist[u] + w < tmp[v]:
                tmp[v] = dist[u] + w
        dist = tmp
    return dist[dst] if dist[dst] != INF else -1
