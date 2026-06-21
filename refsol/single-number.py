def singleNumber(nums):
    result = 0
    for n in nums:
        result ^= n
    return result
