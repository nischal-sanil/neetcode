class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = {}      # userId -> list of (time, tweetId)
        self.following = {}   # userId -> set of followeeIds

    def postTweet(self, userId, tweetId):
        self.tweets.setdefault(userId, []).append((self.time, tweetId))
        self.time += 1

    def getNewsFeed(self, userId):
        users = set(self.following.get(userId, set()))
        users.add(userId)
        candidates = []
        for u in users:
            candidates.extend(self.tweets.get(u, []))
        candidates.sort(key=lambda t: t[0], reverse=True)
        return [tid for _, tid in candidates[:10]]

    def follow(self, followerId, followeeId):
        if followerId == followeeId:
            return
        self.following.setdefault(followerId, set()).add(followeeId)

    def unfollow(self, followerId, followeeId):
        if followerId in self.following:
            self.following[followerId].discard(followeeId)
