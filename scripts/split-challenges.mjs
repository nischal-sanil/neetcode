// One-time migration: split the monolithic data/challenges.json into one bare
// Challenge object per slug under data/challenges/<slug>.json. Safe to re-run
// (idempotent). After this lands, data/challenges.json can be deleted.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcPath = join(root, "data/challenges.json");
const outDir = join(root, "data/challenges");

if (!existsSync(srcPath)) {
  console.log("data/challenges.json not found — nothing to split (already migrated).");
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const { challenges } = JSON.parse(readFileSync(srcPath, "utf8"));

for (const ch of challenges) {
  writeFileSync(join(outDir, `${ch.slug}.json`), JSON.stringify(ch, null, 2) + "\n");
}
console.log(`Split ${challenges.length} challenges into data/challenges/<slug>.json`);
