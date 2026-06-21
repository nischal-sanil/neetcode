# Parity backend: runs serialize(build(value)) for each fixture through the
# canonical Python harness so scripts/serde-parity.mjs can assert the Python and
# JS serde produce identical output.
#
# argv: <harness_path>   stdin: { fixtures: [{type, value}] }   stdout: { out: [...] }

import sys
import json


def main():
    harness_path = sys.argv[1]
    cfg = json.load(sys.stdin)
    ns = {}
    with open(harness_path) as f:
        exec(compile(f.read(), harness_path, "exec"), ns)

    out = []
    for fx in cfg["fixtures"]:
        t, v = fx["type"], fx["value"]
        if t == "tree":
            out.append(ns["_serialize_tree"](ns["_build_tree"](v)))
        elif t == "linkedlist":
            out.append(ns["_serialize_list"](ns["_build_list"](v)))
        elif t == "linkedlist-random":
            out.append(ns["_serialize_random"](ns["_build_random"](v)))
        elif t == "graph-node":
            out.append(ns["_serialize_graph"](ns["_build_graph"](v)))
        else:
            out.append(v)
    print(json.dumps({"out": out}))


main()
