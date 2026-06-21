def numDistinct(s, t):
    m, n = len(s), len(t)
    # dp[j] = number of distinct subsequences of s[:i] equal to t[:j]
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, m + 1):
        # iterate j backwards to use previous row's values
        for j in range(n, 0, -1):
            if s[i - 1] == t[j - 1]:
                dp[j] += dp[j - 1]
    return dp[n]
