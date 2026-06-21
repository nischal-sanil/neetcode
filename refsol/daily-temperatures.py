def dailyTemperatures(temperatures):
    answer = [0] * len(temperatures)
    stack = []  # indices of days with no warmer day seen yet
    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            j = stack.pop()
            answer[j] = i - j
        stack.append(i)
    return answer
