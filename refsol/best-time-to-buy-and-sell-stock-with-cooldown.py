def maxProfit(prices):
    if not prices:
        return 0
    # hold: max profit while holding a share
    # sold: max profit just sold today (next day is cooldown)
    # rest: max profit not holding and not in forced cooldown
    hold = float("-inf")
    sold = 0
    rest = 0
    for p in prices:
        prev_sold = sold
        sold = hold + p
        hold = max(hold, rest - p)
        rest = max(rest, prev_sold)
    return max(sold, rest)
