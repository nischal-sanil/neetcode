import heapq


def minCostConnectPoints(points):
    n = len(points)
    if n <= 1:
        return 0
    visited = [False] * n
    heap = [(0, 0)]
    total = 0
    count = 0
    while heap and count < n:
        dist, i = heapq.heappop(heap)
        if visited[i]:
            continue
        visited[i] = True
        total += dist
        count += 1
        xi, yi = points[i]
        for j in range(n):
            if not visited[j]:
                xj, yj = points[j]
                w = abs(xi - xj) + abs(yi - yj)
                heapq.heappush(heap, (w, j))
    return total
