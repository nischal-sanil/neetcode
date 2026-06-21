def subsetsWithDup(nums):
    nums.sort()
    res = []
    subset = []

    def backtrack(i):
        if i == len(nums):
            res.append(subset[:])
            return
        subset.append(nums[i])
        backtrack(i + 1)
        subset.pop()
        while i + 1 < len(nums) and nums[i] == nums[i + 1]:
            i += 1
        backtrack(i + 1)

    backtrack(0)
    return res
