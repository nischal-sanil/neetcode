import heapq


def minMeetingRooms(intervals):
    if not intervals:
        return 0
    intervals.sort(key=lambda iv: iv[0])
    heap = []  # end times of ongoing meetings
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heappop(heap)
        heapq.heappush(heap, end)
    return len(heap)
