def kClosest(points, k):
    # Sort by squared Euclidean distance from origin, take the k closest.
    ordered = sorted(points, key=lambda p: p[0] * p[0] + p[1] * p[1])
    return [list(p) for p in ordered[:k]]
