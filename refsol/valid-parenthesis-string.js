export function checkValidString(s) {
  let lo = 0; // min possible open count
  let hi = 0; // max possible open count
  for (const c of s) {
    if (c === "(") {
      lo += 1;
      hi += 1;
    } else if (c === ")") {
      lo -= 1;
      hi -= 1;
    } else {
      lo -= 1;
      hi += 1;
    }
    if (hi < 0) return false;
    if (lo < 0) lo = 0;
  }
  return lo === 0;
}
