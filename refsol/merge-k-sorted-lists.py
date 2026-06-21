import heapq


def mergeKLists(lists):
    # `lists` is a list of value-arrays; build ListNodes so the harness can
    # serialize the returned head as a linked list.
    heads = []
    for vals in lists:
        node = _build(vals)
        if node is not None:
            heads.append(node)

    heap = []
    for i, node in enumerate(heads):
        heapq.heappush(heap, (node.val, i, node))

    dummy = ListNode()
    tail = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node
        tail = node
        if node.next is not None:
            heapq.heappush(heap, (node.next.val, i, node.next))
    tail.next = None
    return dummy.next


def _build(vals):
    head = None
    for v in reversed(vals):
        head = ListNode(v, head)
    return head
