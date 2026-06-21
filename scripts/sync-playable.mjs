// Single writer for problems.json `playable`: a problem is playable iff a
// data/challenges/<slug>.json file exists. Avoids per-problem write contention
// while many agents author challenge files in parallel. Run in predev/prebuild.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data/challenges");
const problemsPath = join(root, "data/problems.json");

const playable = new Set(
  readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f !== "index.ts")
    .map((f) => f.slice(0, -5)),
);

const file = JSON.parse(readFileSync(problemsPath, "utf8"));
let changed = 0;
for (const p of file.problems) {
  const next = playable.has(p.slug);
  if (p.playable !== next) {
    p.playable = next;
    changed++;
  }
}
writeFileSync(problemsPath, JSON.stringify(file, null, 2) + "\n");
console.log(`Synced playable on ${file.problems.length} problems (${changed} changed, ${playable.size} playable).`);
