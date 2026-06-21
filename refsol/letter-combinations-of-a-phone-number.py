def letterCombinations(digits):
    if not digits:
        return []
    mapping = {
        "2": "abc",
        "3": "def",
        "4": "ghi",
        "5": "jkl",
        "6": "mno",
        "7": "pqrs",
        "8": "tuv",
        "9": "wxyz",
    }
    result = [""]
    for d in digits:
        result = [prefix + ch for prefix in result for ch in mapping[d]]
    return result
