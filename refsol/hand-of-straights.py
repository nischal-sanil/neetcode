from collections import Counter
import heapq


def isNStraightHand(hand, groupSize):
    if len(hand) % groupSize != 0:
        return False
    count = Counter(hand)
    heap = list(count.keys())
    heapq.heapify(heap)
    while heap:
        smallest = heap[0]
        for v in range(smallest, smallest + groupSize):
            if count[v] == 0:
                return False
            count[v] -= 1
            if count[v] == 0:
                if v != heap[0]:
                    return False
                heapq.heappop(heap)
    return True
