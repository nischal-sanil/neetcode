from collections import defaultdict


class DetectSquares:
    def __init__(self):
        self.counts = defaultdict(int)
        self.points = []

    def add(self, point):
        self.counts[(point[0], point[1])] += 1
        self.points.append(point)

    def count(self, point):
        px, py = point
        total = 0
        for x, y in self.points:
            if abs(px - x) != abs(py - y) or px == x or py == y:
                continue
            total += self.counts[(px, y)] * self.counts[(x, py)]
        return total
