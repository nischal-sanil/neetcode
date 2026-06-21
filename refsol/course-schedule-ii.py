from collections import deque


def findOrder(numCourses, prerequisites):
    indeg = [0] * numCourses
    adj = [[] for _ in range(numCourses)]
    for course, pre in prerequisites:
        adj[pre].append(course)
        indeg[course] += 1

    q = deque(i for i in range(numCourses) if indeg[i] == 0)
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nxt in adj[node]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)

    return order if len(order) == numCourses else []
