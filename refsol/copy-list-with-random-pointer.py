class _CopyNode:
    def __init__(self, val):
        self.val = val
        self.next = None
        self.random = None


def copyRandomList(head):
    if head is None:
        return None
    # Map each original node to its fresh copy.
    clones = {}
    cur = head
    while cur is not None:
        clones[cur] = _CopyNode(cur.val)
        cur = cur.next
    cur = head
    while cur is not None:
        copy = clones[cur]
        copy.next = clones[cur.next] if cur.next is not None else None
        copy.random = clones[cur.random] if cur.random is not None else None
        cur = cur.next
    return clones[head]
