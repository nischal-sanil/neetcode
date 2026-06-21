def buildTree(preorder, inorder):
    idx = {v: i for i, v in enumerate(inorder)}
    pre = [0]

    def build(lo, hi):
        if lo > hi:
            return None
        root_val = preorder[pre[0]]
        pre[0] += 1
        node = TreeNode(root_val)
        m = idx[root_val]
        node.left = build(lo, m - 1)
        node.right = build(m + 1, hi)
        return node

    return build(0, len(inorder) - 1)
