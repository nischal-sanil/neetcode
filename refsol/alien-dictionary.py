from collections import deque


def alienOrder(words):
    # Build graph over all distinct characters.
    adj = {c: set() for w in words for c in w}
    indeg = {c: 0 for c in adj}

    for a, b in zip(words, words[1:]):
        ln = min(len(a), len(b))
        if len(a) > len(b) and a[:ln] == b[:ln]:
            # Prefix violation: longer word before its own prefix is invalid.
            return ""
        for i in range(ln):
            if a[i] != b[i]:
                if b[i] not in adj[a[i]]:
                    adj[a[i]].add(b[i])
                    indeg[b[i]] += 1
                break

    # Kahn's algorithm (BFS topological sort).
    q = deque(c for c in indeg if indeg[c] == 0)
    out = []
    while q:
        c = q.popleft()
        out.append(c)
        for nxt in adj[c]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)

    if len(out) != len(indeg):
        return ""  # cycle
    return "".join(out)
