def combinationSum2(candidates, target):
    candidates.sort()
    res = []
    combo = []

    def backtrack(start, remaining):
        if remaining == 0:
            res.append(combo[:])
            return
        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            if candidates[i] > remaining:
                break
            combo.append(candidates[i])
            backtrack(i + 1, remaining - candidates[i])
            combo.pop()

    backtrack(0, target)
    return res
