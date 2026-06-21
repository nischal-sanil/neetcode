// Independent length-prefixed encoding: "<len>#<string>" per item. Robust to
// any characters (including '#' and digits) since decode reads the explicit
// length rather than scanning for a delimiter. Only the round-trip identity is
// verified, so the exact wire format is free to differ from other references.
export class Codec {
  encode(strs) {
    let out = "";
    for (const s of strs) {
      out += `${s.length}#${s}`;
    }
    return out;
  }

  decode(s) {
    const res = [];
    let i = 0;
    while (i < s.length) {
      let j = i;
      while (s[j] !== "#") j += 1;
      const length = parseInt(s.slice(i, j), 10);
      const start = j + 1;
      res.push(s.slice(start, start + length));
      i = start + length;
    }
    return res;
  }

  encodeDecode(strs) {
    return this.decode(this.encode(strs));
  }
}
