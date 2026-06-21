def topKFrequent(nums, k):
    counts = {}
    for n in nums:
        counts[n] = counts.get(n, 0) + 1
    ordered = sorted(counts, key=lambda x: counts[x], reverse=True)
    return ordered[:k]
