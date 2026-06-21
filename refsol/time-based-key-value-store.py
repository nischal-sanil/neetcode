import bisect


class TimeMap:
    def __init__(self):
        self.store = {}

    def set(self, key, value, timestamp):
        if key not in self.store:
            self.store[key] = ([], [])
        times, values = self.store[key]
        times.append(timestamp)
        values.append(value)

    def get(self, key, timestamp):
        if key not in self.store:
            return ""
        times, values = self.store[key]
        i = bisect.bisect_right(times, timestamp)
        if i == 0:
            return ""
        return values[i - 1]
