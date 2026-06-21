// Generates lib/workers/py-harness.generated.ts from lib/workers/py_harness.py
// so the Python worker can embed the harness as a string. py_harness.py stays
// the single source of truth; run this in predev/prebuild.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "lib/workers/py_harness.py"), "utf8");

const out =
  "// AUTO-GENERATED from lib/workers/py_harness.py by scripts/gen-py-harness.mjs.\n" +
  "// Do not edit by hand — edit py_harness.py and re-run `npm run gen`.\n\n" +
  "export const PY_HARNESS = " +
  JSON.stringify(src) +
  ";\n";

writeFileSync(join(root, "lib/workers/py-harness.generated.ts"), out);
console.log("Wrote lib/workers/py-harness.generated.ts");
