import heapq


def minInterval(intervals, queries):
    intervals.sort()
    res = {}
    heap = []
    i = 0
    n = len(intervals)
    for q in sorted(queries):
        while i < n and intervals[i][0] <= q:
            left, right = intervals[i]
            heapq.heappush(heap, (right - left + 1, right))
            i += 1
        while heap and heap[0][1] < q:
            heapq.heappop(heap)
        res[q] = heap[0][0] if heap else -1
    return [res[q] for q in queries]
