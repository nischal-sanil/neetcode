def maxPathSum(root):
    best = [float("-inf")]

    def gain(node):
        if node is None:
            return 0
        left = max(gain(node.left), 0)
        right = max(gain(node.right), 0)
        best[0] = max(best[0], node.val + left + right)
        return node.val + max(left, right)

    gain(root)
    return best[0]
