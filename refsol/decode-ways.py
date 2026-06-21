def numDecodings(s):
    if not s or s[0] == "0":
        return 0
    n = len(s)
    # dp[i] = number of ways to decode s[:i]
    prev2, prev1 = 1, 1  # dp[0], dp[1]
    for i in range(2, n + 1):
        cur = 0
        if s[i - 1] != "0":
            cur += prev1
        two = int(s[i - 2:i])
        if 10 <= two <= 26:
            cur += prev2
        prev2, prev1 = prev1, cur
    return prev1
