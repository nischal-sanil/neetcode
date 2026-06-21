from collections import deque


class Codec:
    def serialize(self, root):
        # BFS / level-order encoding with explicit null markers.
        if root is None:
            return ""
        out = []
        q = deque([root])
        while q:
            node = q.popleft()
            if node is None:
                out.append("n")
                continue
            out.append(str(node.val))
            q.append(node.left)
            q.append(node.right)
        return " ".join(out)

    def deserialize(self, data):
        if data == "":
            return None
        toks = data.split(" ")
        root = TreeNode(int(toks[0]))
        q = deque([root])
        i = 1
        while q:
            node = q.popleft()
            if i < len(toks):
                t = toks[i]
                i += 1
                if t != "n":
                    node.left = TreeNode(int(t))
                    q.append(node.left)
            if i < len(toks):
                t = toks[i]
                i += 1
                if t != "n":
                    node.right = TreeNode(int(t))
                    q.append(node.right)
        return root


def serializeDeserialize(root):
    codec = Codec()
    return codec.deserialize(codec.serialize(root))
