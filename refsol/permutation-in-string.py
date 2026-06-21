def checkInclusion(s1, s2):
    if len(s1) > len(s2):
        return False
    need = [0] * 26
    window = [0] * 26
    for ch in s1:
        need[ord(ch) - ord('a')] += 1
    k = len(s1)
    for i, ch in enumerate(s2):
        window[ord(ch) - ord('a')] += 1
        if i >= k:
            window[ord(s2[i - k]) - ord('a')] -= 1
        if i >= k - 1 and window == need:
            return True
    return False
