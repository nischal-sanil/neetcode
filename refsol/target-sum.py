def findTargetSumWays(nums, target):
    # Count assignments of +/- to each number summing to target.
    counts = {0: 1}
    for n in nums:
        nxt = {}
        for total, c in counts.items():
            nxt[total + n] = nxt.get(total + n, 0) + c
            nxt[total - n] = nxt.get(total - n, 0) + c
        counts = nxt
    return counts.get(target, 0)
