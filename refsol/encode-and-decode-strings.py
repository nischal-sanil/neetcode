class Codec:
    # Length-prefixed encoding: "<len>#<string>" per item. Robust to any
    # characters (including '#' and digits) because decode reads the explicit
    # length rather than scanning for a delimiter.
    def encode(self, strs):
        out = []
        for s in strs:
            out.append(f"{len(s)}#{s}")
        return "".join(out)

    def decode(self, s):
        res = []
        i = 0
        n = len(s)
        while i < n:
            j = i
            while s[j] != "#":
                j += 1
            length = int(s[i:j])
            start = j + 1
            res.append(s[start:start + length])
            i = start + length
        return res

    def encodeDecode(self, strs):
        return self.decode(self.encode(strs))
