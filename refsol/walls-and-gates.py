from collections import deque

INF = 2147483647


def wallsAndGates(rooms):
    if not rooms or not rooms[0]:
        return
    m, n = len(rooms), len(rooms[0])
    q = deque()
    for r in range(m):
        for c in range(n):
            if rooms[r][c] == 0:
                q.append((r, c))
    while q:
        r, c = q.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and rooms[nr][nc] == INF:
                rooms[nr][nc] = rooms[r][c] + 1
                q.append((nr, nc))
