def rob(nums):
    if len(nums) == 1:
        return nums[0]

    def rob_line(houses):
        prev, curr = 0, 0
        for n in houses:
            prev, curr = curr, max(curr, prev + n)
        return curr

    return max(rob_line(nums[1:]), rob_line(nums[:-1]))
