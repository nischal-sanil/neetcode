from collections import Counter


def leastInterval(tasks, n):
    counts = Counter(tasks)
    max_count = max(counts.values())
    num_max = sum(1 for c in counts.values() if c == max_count)
    slots = (max_count - 1) * (n + 1) + num_max
    return max(slots, len(tasks))
