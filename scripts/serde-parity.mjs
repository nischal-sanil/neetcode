// Guards that the JS serde (lib/workers/serde.ts) and the Python harness
// (lib/workers/py_harness.py) serialize structured I/O identically. For each
// fixture, asserts serialize(build(value)) matches between languages — the
// single most important defence against the two implementations drifting.
//
// Run: node --experimental-strip-types scripts/serde-parity.mjs

import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  buildTree,
  serializeTree,
  buildList,
  serializeList,
  buildGraph,
  serializeGraph,
  buildRandomList,
  serializeRandomList,
} from "../lib/workers/serde.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const HARNESS = join(root, "lib/workers/py_harness.py");
const PARITY = join(root, "scripts/lib/parity_runner.py");

const fixtures = [
  { type: "tree", value: [1, 2, 3, null, null, 4, 5] },
  { type: "tree", value: [] },
  { type: "tree", value: [1] },
  { type: "tree", value: [1, 2, null, 3] },
  { type: "tree", value: [5, 1, 4, null, null, 3, 6] },
  { type: "linkedlist", value: [1, 2, 3, 4, 5] },
  { type: "linkedlist", value: [] },
  { type: "linkedlist", value: [7] },
  { type: "graph-node", value: [[2, 4], [1, 3], [2, 4], [1, 3]] },
  { type: "graph-node", value: [[]] },
  { type: "graph-node", value: [] },
  { type: "graph-node", value: [[2, 3], [1], [1]] },
  { type: "linkedlist-random", value: [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]] },
  { type: "linkedlist-random", value: [] },
];

function jsSerde(type, value) {
  switch (type) {
    case "tree":
      return serializeTree(buildTree(value));
    case "linkedlist":
      return serializeList(buildList(value));
    case "graph-node":
      return serializeGraph(buildGraph(value));
    case "linkedlist-random":
      return serializeRandomList(buildRandomList(value));
    default:
      return value;
  }
}

const pyOut = JSON.parse(
  execFileSync("python3", [PARITY, HARNESS], {
    input: JSON.stringify({ fixtures }),
    encoding: "utf8",
  }),
).out;

let failures = 0;
fixtures.forEach((fx, i) => {
  const js = JSON.stringify(jsSerde(fx.type, fx.value));
  const py = JSON.stringify(pyOut[i]);
  if (js !== py) {
    failures++;
    console.log(`  ✗ ${fx.type} #${i}: js=${js} py=${py}`);
  }
});

if (failures) {
  console.log(`serde parity: ${failures}/${fixtures.length} FAILED`);
  process.exit(1);
}
console.log(`serde parity: ${fixtures.length}/${fixtures.length} fixtures match (JS == Python).`);
