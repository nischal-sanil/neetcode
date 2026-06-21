def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0
    intervals.sort(key=lambda iv: iv[1])
    removed = 0
    prev_end = intervals[0][1]
    for start, end in intervals[1:]:
        if start < prev_end:
            removed += 1
        else:
            prev_end = end
    return removed
