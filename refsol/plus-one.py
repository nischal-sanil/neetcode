def plusOne(digits):
    result = digits[:]
    i = len(result) - 1
    while i >= 0:
        if result[i] < 9:
            result[i] += 1
            return result
        result[i] = 0
        i -= 1
    return [1] + result
