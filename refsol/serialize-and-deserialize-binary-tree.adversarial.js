// Independent reference: BFS/level-order Codec (author uses preorder DFS).
// serializeDeserialize round-trips a tree through serialize -> deserialize.

class Codec {
  serialize(root) {
    const out = [];
    const queue = [root];
    let head = 0;
    while (head < queue.length) {
      const node = queue[head++];
      if (node === null || node === undefined) {
        out.push("n");
      } else {
        out.push(String(node.val));
        queue.push(node.left ?? null);
        queue.push(node.right ?? null);
      }
    }
    return out.join(" ");
  }

  deserialize(data) {
    const tokens = data.split(" ");
    if (tokens.length === 0 || tokens[0] === "n") return null;
    const root = { val: Number(tokens[0]), left: null, right: null };
    const queue = [root];
    let head = 0;
    let i = 1;
    while (head < queue.length && i < tokens.length) {
      const node = queue[head++];
      const lt = tokens[i++];
      if (lt !== undefined && lt !== "n") {
        node.left = { val: Number(lt), left: null, right: null };
        queue.push(node.left);
      }
      const rt = tokens[i++];
      if (rt !== undefined && rt !== "n") {
        node.right = { val: Number(rt), left: null, right: null };
        queue.push(node.right);
      }
    }
    return root;
  }
}

export function serializeDeserialize(root) {
  const codec = new Codec();
  return codec.deserialize(codec.serialize(root));
}
