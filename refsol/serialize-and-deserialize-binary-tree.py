class Codec:
    def serialize(self, root):
        out = []

        def dfs(node):
            if node is None:
                out.append("#")
                return
            out.append(str(node.val))
            dfs(node.left)
            dfs(node.right)

        dfs(root)
        return ",".join(out)

    def deserialize(self, data):
        tokens = iter(data.split(","))

        def dfs():
            tok = next(tokens)
            if tok == "#":
                return None
            node = TreeNode(int(tok))
            node.left = dfs()
            node.right = dfs()
            return node

        return dfs()


def serializeDeserialize(root):
    codec = Codec()
    return codec.deserialize(codec.serialize(root))
