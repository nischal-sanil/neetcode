def checkValidString(s):
    lo = 0  # min possible open count
    hi = 0  # max possible open count
    for c in s:
        if c == "(":
            lo += 1
            hi += 1
        elif c == ")":
            lo -= 1
            hi -= 1
        else:  # '*'
            lo -= 1
            hi += 1
        if hi < 0:
            return False
        if lo < 0:
            lo = 0
    return lo == 0
