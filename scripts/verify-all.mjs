// Verify every challenge file against its reference solution(s). Prints a
// pass/fail line per slug and exits non-zero if any challenge fails. This is
// the CI / prebuild gate that guarantees no wrong `expected` ships.
//
// Run: node --experimental-strip-types scripts/verify-all.mjs [slugPrefix]

import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { verifyChallenge } from "./verify-challenge.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "data/challenges");
const filter = process.argv[2] ?? "";

const slugs = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.slice(0, -5))
  .filter((s) => s.startsWith(filter))
  .sort();

let passed = 0;
const failed = [];

for (const slug of slugs) {
  const { ok, failures, refs } = await verifyChallenge(slug);
  if (ok) {
    passed++;
    console.log(`  ✓ ${slug} (${refs})`);
  } else {
    failed.push(slug);
    console.log(`  ✗ ${slug}`);
    for (const f of failures) console.log(`      ${f}`);
  }
}

console.log(`\n${passed}/${slugs.length} challenges verified.`);
if (failed.length) {
  console.log(`FAILED: ${failed.join(", ")}`);
  process.exit(1);
}
