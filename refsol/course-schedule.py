def canFinish(numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for course, prereq in prerequisites:
        adj[prereq].append(course)
        indegree[course] += 1

    queue = [c for c in range(numCourses) if indegree[c] == 0]
    visited = 0
    while queue:
        node = queue.pop()
        visited += 1
        for nxt in adj[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)
    return visited == numCourses
