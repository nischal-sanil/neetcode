# Offline verifier backend: execs the canonical harness (lib/workers/py_harness.py)
# and a reference solution into one namespace, then runs each test case through
# the SAME _run_function / _run_design the worker uses, printing got per case.
#
# argv: <harness_path> <ref_path>
# stdin (JSON): { kind, entry, class_name, arg_types, return_type, mutates,
#                 cases: [{ args, operations? }] }
# stdout (JSON): { results: [ {got: ...} | {error: "..."} ] }

import sys
import json


def main():
    harness_path = sys.argv[1]
    ref_path = sys.argv[2]
    cfg = json.load(sys.stdin)

    ns = {}
    with open(harness_path) as f:
        exec(compile(f.read(), harness_path, "exec"), ns)
    with open(ref_path) as f:
        exec(compile(f.read(), ref_path, "exec"), ns)

    is_design = cfg.get("kind") == "design"
    results = []
    for case in cfg["cases"]:
        try:
            if is_design:
                got = ns["_run_design"](cfg["class_name"], case["operations"], case["args"])
            else:
                got = ns["_run_function"](
                    cfg["entry"],
                    case["args"],
                    cfg.get("arg_types"),
                    cfg.get("return_type"),
                    cfg.get("mutates"),
                )
            results.append({"got": got})
        except Exception as e:  # noqa: BLE001 — report any solution error per case
            results.append({"error": f"{type(e).__name__}: {e}"})

    print(json.dumps({"results": results}))


main()
