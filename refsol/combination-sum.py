def combinationSum(candidates, target):
    res = []
    candidates.sort()

    def backtrack(start, remaining, path):
        if remaining == 0:
            res.append(path[:])
            return
        for i in range(start, len(candidates)):
            c = candidates[i]
            if c > remaining:
                break
            path.append(c)
            backtrack(i, remaining - c, path)
            path.pop()

    backtrack(0, target, [])
    return res
