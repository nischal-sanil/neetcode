def reverseKGroup(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy

    while True:
        # find the k-th node from group_prev
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if kth is None:
                return dummy.next

        group_next = kth.next

        # reverse the group
        prev = group_next
        cur = group_prev.next
        while cur is not group_next:
            nxt = cur.next
            cur.next = prev
            prev = cur
            cur = nxt

        # reconnect
        new_group_prev = group_prev.next
        group_prev.next = kth
        group_prev = new_group_prev
