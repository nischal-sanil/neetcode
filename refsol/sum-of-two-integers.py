def getSum(a, b):
    # Add a and b without using + or -, using 32-bit two's-complement arithmetic.
    mask = 0xFFFFFFFF
    while b & mask:
        carry = (a & b) << 1
        a = a ^ b
        b = carry
    a &= mask
    # Interpret as signed 32-bit.
    if a > 0x7FFFFFFF:
        a = ~(a ^ mask)
    return a
