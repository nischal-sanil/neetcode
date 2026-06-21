// Adversarial reference. Different approach from the author:
// keep a single global timeline of all tweets and filter at query time,
// rather than per-user tweet lists.
export class Twitter {
  constructor() {
    this.timeline = []; // global list of { userId, tweetId } in post order
    this.followMap = new Map(); // followerId -> Set of followeeIds
  }

  postTweet(userId, tweetId) {
    this.timeline.push({ userId, tweetId });
  }

  getNewsFeed(userId) {
    const visible = new Set();
    visible.add(userId);
    const followees = this.followMap.get(userId);
    if (followees) {
      for (const f of followees) visible.add(f);
    }
    const feed = [];
    // walk the global timeline from newest to oldest, collect up to 10
    for (let i = this.timeline.length - 1; i >= 0 && feed.length < 10; i--) {
      const t = this.timeline[i];
      if (visible.has(t.userId)) feed.push(t.tweetId);
    }
    return feed;
  }

  follow(followerId, followeeId) {
    if (followerId === followeeId) return;
    if (!this.followMap.has(followerId)) this.followMap.set(followerId, new Set());
    this.followMap.get(followerId).add(followeeId);
  }

  unfollow(followerId, followeeId) {
    const followees = this.followMap.get(followerId);
    if (followees) followees.delete(followeeId);
  }
}
