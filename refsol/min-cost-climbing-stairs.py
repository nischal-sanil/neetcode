def minCostClimbingStairs(cost):
    n = len(cost)
    prev2, prev1 = 0, 0
    for i in range(2, n + 1):
        prev2, prev1 = prev1, min(prev1 + cost[i - 1], prev2 + cost[i - 2])
    return prev1
