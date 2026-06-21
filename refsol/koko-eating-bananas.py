import math


def minEatingSpeed(piles, h):
    lo, hi = 1, max(piles)

    def hours(k):
        return sum(math.ceil(p / k) for p in piles)

    while lo < hi:
        mid = (lo + hi) // 2
        if hours(mid) <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo
