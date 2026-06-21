# Structured I/O (de)serialization + call orchestration for the Python side.
# Behaviour MUST stay identical to lib/workers/serde.ts (scripts/serde-parity.mjs
# guards drift). This file is the single source of truth; the Python worker
# embeds it via the generated lib/workers/py-harness.generated.ts and the
# offline verifier execs it directly (scripts/lib/py_runner.py).
#
# Exec'd into the user's namespace BEFORE the user code, so a solution can
# reference TreeNode / ListNode / Node.

_LIST_CAP = 10000


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Node:  # graph (clone-graph); random-pointer problems redefine this
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


def _build_tree(level):
    if not level or level[0] is None:
        return None
    root = TreeNode(level[0])
    queue = [root]
    i = 1
    head = 0
    while head < len(queue) and i < len(level):
        node = queue[head]
        head += 1
        if i < len(level):
            v = level[i]
            i += 1
            if v is not None:
                node.left = TreeNode(v)
                queue.append(node.left)
        if i < len(level):
            v = level[i]
            i += 1
            if v is not None:
                node.right = TreeNode(v)
                queue.append(node.right)
    return root


def _serialize_tree(root):
    if root is None:
        return []
    out = []
    queue = [root]
    head = 0
    while head < len(queue) and len(out) < _LIST_CAP:
        node = queue[head]
        head += 1
        if node is not None:
            out.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            out.append(None)
    while out and out[-1] is None:
        out.pop()
    return out


def _build_list(vals, pos=-1):
    if not vals:
        return None
    nodes = [ListNode(v) for v in vals]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if pos is not None and 0 <= pos < len(nodes):
        nodes[-1].next = nodes[pos]
    return nodes[0]


def _serialize_list(head):
    out = []
    seen = set()
    cur = head
    while cur is not None and len(out) < _LIST_CAP:
        if id(cur) in seen:
            break
        seen.add(id(cur))
        out.append(cur.val)
        cur = cur.next
    return out


class _RandomNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None
        self.random = None


def _build_random(arr):
    if not arr:
        return None
    nodes = [_RandomNode(pair[0]) for pair in arr]
    for i in range(len(nodes)):
        if i < len(nodes) - 1:
            nodes[i].next = nodes[i + 1]
        ri = arr[i][1]
        nodes[i].random = None if ri is None else nodes[ri]
    return nodes[0]


def _serialize_random(head):
    order = []
    index = {}
    cur = head
    while cur is not None and len(order) < _LIST_CAP:
        if id(cur) in index:
            break
        index[id(cur)] = len(order)
        order.append(cur)
        cur = cur.next
    return [[n.val, (None if n.random is None else index.get(id(n.random)))] for n in order]


def _build_graph(adj):
    if not adj:
        return None
    nodes = [Node(i + 1) for i in range(len(adj))]
    for i in range(len(adj)):
        for nb in adj[i]:
            nodes[i].neighbors.append(nodes[nb - 1])
    return nodes[0]


def _serialize_graph(node):
    if node is None:
        return []
    visited = {node.val: node}
    queue = [node]
    head = 0
    while head < len(queue):
        cur = queue[head]
        head += 1
        for nb in cur.neighbors:
            if nb.val not in visited:
                visited[nb.val] = nb
                queue.append(nb)
    vals = sorted(visited.keys())
    return [sorted(nb.val for nb in visited[v].neighbors) for v in vals]


def _deserialize_arg(value, t):
    if t == "tree":
        return _build_tree(value)
    if t == "linkedlist":
        return _build_list(value)
    if t == "linkedlist-cycle":
        value = value or {}
        return _build_list(value.get("list"), value.get("pos", -1))
    if t == "linkedlist-random":
        return _build_random(value)
    if t == "graph-node":
        return _build_graph(value)
    return value


def _serialize_return(value, t):
    if t == "tree":
        return _serialize_tree(value)
    if t == "linkedlist":
        return _serialize_list(value)
    if t == "linkedlist-random":
        return _serialize_random(value)
    if t == "graph-node":
        return _serialize_graph(value)
    return value


def _run_function(entry, raw_args, arg_types, return_type, mutates):
    fn = globals()[entry]
    call_args = []
    for i, a in enumerate(raw_args):
        t = arg_types[i] if arg_types and i < len(arg_types) else "plain"
        call_args.append(_deserialize_arg(a, t))
    ret = fn(*call_args)
    if mutates is not None:
        t = arg_types[mutates] if arg_types else "plain"
        return _serialize_return(call_args[mutates], t)
    return _serialize_return(ret, return_type or "plain")


def _run_design(class_name, operations, args_list):
    cls = globals()[class_name]
    out = []
    inst = None
    for i, op in enumerate(operations):
        a = args_list[i] if i < len(args_list) else []
        if i == 0:
            inst = cls(*a)
            out.append(None)
        else:
            out.append(getattr(inst, op)(*a))
    return out
