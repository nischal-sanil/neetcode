def maxProduct(nums):
    result = nums[0]
    cur_max = nums[0]
    cur_min = nums[0]
    for n in nums[1:]:
        candidates = (n, cur_max * n, cur_min * n)
        cur_max = max(candidates)
        cur_min = min(candidates)
        result = max(result, cur_max)
    return result
