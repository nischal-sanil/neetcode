// Adversarial reference: escape-based delimiter encoding (NOT length-prefix).
// Each string is escaped (backslash -> "\\", separator ";" -> "\;") and emitted
// with a leading separator, so item boundaries are the UNESCAPED separators.
// Leading-separator framing makes the empty list ("") distinct from a list
// containing one empty string (";"), which a plain join could not distinguish.
export class Codec {
  encode(strs) {
    let out = "";
    for (const s of strs) {
      const escaped = s.replace(/\\/g, "\\\\").replace(/;/g, "\\;");
      out += ";" + escaped;
    }
    return out;
  }

  decode(s) {
    const res = [];
    let i = 0;
    const n = s.length;
    while (i < n) {
      // s[i] must be an unescaped separator marking the start of an item.
      i += 1; // skip the leading ';'
      let cur = "";
      while (i < n && s[i] !== ";") {
        if (s[i] === "\\") {
          cur += s[i + 1];
          i += 2;
        } else {
          cur += s[i];
          i += 1;
        }
      }
      res.push(cur);
    }
    return res;
  }

  encodeDecode(strs) {
    return this.decode(this.encode(strs));
  }
}
