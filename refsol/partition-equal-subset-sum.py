def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2
    dp = {0}
    for n in nums:
        nxt = set(dp)
        for s in dp:
            if s + n == target:
                return True
            if s + n < target:
                nxt.add(s + n)
        dp = nxt
    return target in dp
