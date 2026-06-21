def reorderList(head):
    if head is None or head.next is None:
        return
    # Find middle (slow ends at middle for even/odd).
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    # Reverse the second half.
    second = slow.next
    slow.next = None
    prev = None
    while second:
        nxt = second.next
        second.next = prev
        prev = second
        second = nxt
    second = prev
    # Merge the two halves.
    first = head
    while second:
        f_next = first.next
        s_next = second.next
        first.next = second
        second.next = f_next
        first = f_next
        second = s_next
