export function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  if (beginWord === endWord) return 1;

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let queue = [beginWord];
  const visited = new Set([beginWord]);
  let steps = 1;

  while (queue.length) {
    const next = [];
    for (const word of queue) {
      if (word === endWord) return steps;
      for (let i = 0; i < word.length; i++) {
        for (const c of alphabet) {
          if (c === word[i]) continue;
          const candidate = word.slice(0, i) + c + word.slice(i + 1);
          if (wordSet.has(candidate) && !visited.has(candidate)) {
            visited.add(candidate);
            next.push(candidate);
          }
        }
      }
    }
    queue = next;
    steps++;
  }

  return 0;
}
