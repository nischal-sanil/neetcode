def partition(s):
    res = []
    part = []

    def backtrack(start):
        if start == len(s):
            res.append(part[:])
            return
        for end in range(start + 1, len(s) + 1):
            sub = s[start:end]
            if sub == sub[::-1]:
                part.append(sub)
                backtrack(end)
                part.pop()

    backtrack(0)
    return res
