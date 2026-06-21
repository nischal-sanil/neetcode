def reverse(x):
    sign = -1 if x < 0 else 1
    digits = str(abs(x))[::-1]
    result = sign * int(digits)
    if result < -(2 ** 31) or result > 2 ** 31 - 1:
        return 0
    return result
