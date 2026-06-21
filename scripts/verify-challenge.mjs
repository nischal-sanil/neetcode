// Verify a single challenge file's `expected` values by running reference
// solutions (refsol/<slug>.py / .js, plus optional .adversarial.*) through the
// SAME serde/compare logic the workers use. A challenge passes only if EVERY
// reference reproduces EVERY expected value under the challenge's comparison.
//
// Run: node --experimental-strip-types scripts/verify-challenge.mjs <slug>

import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

import { compare } from "../lib/workers/compare.ts";
import { callFunction, callDesign } from "../lib/workers/serde.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const HARNESS = join(root, "lib/workers/py_harness.py");
const PY_RUNNER = join(root, "scripts/lib/py_runner.py");

function deepCopy(v) {
  return structuredClone(v);
}

function runPyRef(ch, refPath) {
  const isDesign = ch.kind === "design";
  const cfg = {
    kind: isDesign ? "design" : "function",
    entry: ch.entry_function,
    class_name: ch.class_name ?? null,
    arg_types: ch.arg_types ?? null,
    return_type: ch.return_type ?? null,
    mutates: ch.mutates_arg ?? null,
    cases: ch.test_cases.map((tc) =>
      isDesign ? { operations: tc.operations, args: tc.args } : { args: tc.args },
    ),
  };
  const out = execFileSync("python3", [PY_RUNNER, HARNESS, refPath], {
    input: JSON.stringify(cfg),
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return JSON.parse(out).results; // [{got}|{error}]
}

async function runJsRef(ch, refPath) {
  const isDesign = ch.kind === "design";
  const mod = await import(pathToFileURL(refPath).href);
  const target = isDesign
    ? mod[ch.class_name] ?? mod.default
    : mod[ch.entry_function] ?? mod.default;
  if (!target) throw new Error(`ref ${refPath} does not export ${isDesign ? ch.class_name : ch.entry_function}`);
  return ch.test_cases.map((tc) => {
    try {
      const got = isDesign
        ? callDesign(target, tc.operations, deepCopy(tc.args))
        : callFunction(target, deepCopy(tc.args), ch.arg_types, ch.return_type, ch.mutates_arg);
      return { got };
    } catch (e) {
      return { error: String(e?.message ?? e) };
    }
  });
}

// Check one reference's per-case output against the file's expected values.
function checkResults(ch, results, label, failures) {
  ch.test_cases.forEach((tc, i) => {
    const r = results[i];
    if (!r || "error" in r) {
      failures.push(`${label} case ${i + 1}: ${r?.error ?? "no result"}`);
      return;
    }
    if (!compare(r.got, tc.expected, ch.comparison)) {
      failures.push(
        `${label} case ${i + 1}: got ${JSON.stringify(r.got)} expected ${JSON.stringify(tc.expected)}`,
      );
    }
  });
}

export async function verifyChallenge(slug) {
  const chPath = join(root, "data/challenges", `${slug}.json`);
  if (!existsSync(chPath)) return { ok: false, failures: [`no challenge file for ${slug}`], refs: 0 };
  const ch = JSON.parse(readFileSync(chPath, "utf8"));

  const refs = [
    { path: join(root, "refsol", `${slug}.py`), kind: "py", label: "py" },
    { path: join(root, "refsol", `${slug}.adversarial.py`), kind: "py", label: "py-adv" },
    { path: join(root, "refsol", `${slug}.js`), kind: "js", label: "js" },
    { path: join(root, "refsol", `${slug}.adversarial.js`), kind: "js", label: "js-adv" },
  ].filter((r) => existsSync(r.path));

  if (refs.length === 0) return { ok: false, failures: ["no reference solution found"], refs: 0 };

  const failures = [];
  for (const ref of refs) {
    try {
      const results = ref.kind === "py" ? runPyRef(ch, ref.path) : await runJsRef(ch, ref.path);
      checkResults(ch, results, ref.label, failures);
    } catch (e) {
      failures.push(`${ref.label}: ${String(e?.message ?? e).split("\n").slice(-1)[0]}`);
    }
  }
  return { ok: failures.length === 0, failures, refs: refs.length };
}

// CLI
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const slug = process.argv[2];
  if (!slug) {
    console.error("usage: verify-challenge.mjs <slug>");
    process.exit(2);
  }
  const { ok, failures, refs } = await verifyChallenge(slug);
  if (ok) {
    console.log(`PASS ${slug} (${refs} ref${refs === 1 ? "" : "s"})`);
  } else {
    console.log(`FAIL ${slug}`);
    for (const f of failures) console.log(`  - ${f}`);
    process.exit(1);
  }
}
