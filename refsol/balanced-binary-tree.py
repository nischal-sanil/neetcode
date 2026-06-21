def isBalanced(root):
    def height(node):
        # returns height if balanced, else -1
        if node is None:
            return 0
        lh = height(node.left)
        if lh == -1:
            return -1
        rh = height(node.right)
        if rh == -1:
            return -1
        if abs(lh - rh) > 1:
            return -1
        return max(lh, rh) + 1

    return height(root) != -1
