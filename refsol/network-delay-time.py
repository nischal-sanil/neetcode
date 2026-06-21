import heapq


def networkDelayTime(times, n, k):
    adj = {i: [] for i in range(1, n + 1)}
    for u, v, w in times:
        adj[u].append((v, w))

    dist = {}
    heap = [(0, k)]
    while heap:
        d, node = heapq.heappop(heap)
        if node in dist:
            continue
        dist[node] = d
        for nei, w in adj[node]:
            if nei not in dist:
                heapq.heappush(heap, (d + w, nei))

    if len(dist) < n:
        return -1
    return max(dist.values())
