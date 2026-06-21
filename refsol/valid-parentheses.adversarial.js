// Independent approach: repeatedly strip matched pairs until stable.
// A string is valid iff iterative removal of "()", "[]", "{}" reduces it to empty.
export function isValid(s) {
  let prev;
  do {
    prev = s;
    s = s.replace("()", "").replace("[]", "").replace("{}", "");
  } while (s !== prev);
  return s.length === 0;
}
