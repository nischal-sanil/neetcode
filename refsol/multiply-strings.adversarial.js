// Independent approach: build the product by repeated string addition of
// shifted single-digit partial products, instead of an index/position array.

function addStrings(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  let out = [];
  while (i >= 0 || j >= 0 || carry > 0) {
    const da = i >= 0 ? a.charCodeAt(i) - 48 : 0;
    const db = j >= 0 ? b.charCodeAt(j) - 48 : 0;
    const sum = da + db + carry;
    out.push(String(sum % 10));
    carry = Math.floor(sum / 10);
    i--;
    j--;
  }
  return out.reverse().join("");
}

function multiplyByDigit(num, digit) {
  if (digit === 0) return "0";
  let carry = 0;
  let out = [];
  for (let k = num.length - 1; k >= 0; k--) {
    const prod = (num.charCodeAt(k) - 48) * digit + carry;
    out.push(String(prod % 10));
    carry = Math.floor(prod / 10);
  }
  while (carry > 0) {
    out.push(String(carry % 10));
    carry = Math.floor(carry / 10);
  }
  return out.reverse().join("");
}

export function multiply(num1, num2) {
  if (num1 === "0" || num2 === "0") return "0";
  let acc = "0";
  // iterate over digits of num2 from least significant to most significant
  for (let j = num2.length - 1; j >= 0; j--) {
    const digit = num2.charCodeAt(j) - 48;
    let partial = multiplyByDigit(num1, digit);
    if (partial !== "0") {
      // shift left by (num2.length - 1 - j) places
      const shift = num2.length - 1 - j;
      partial = partial + "0".repeat(shift);
    }
    acc = addStrings(acc, partial);
  }
  // strip any leading zeros (shouldn't be any given guards, but be safe)
  let start = 0;
  while (start < acc.length - 1 && acc[start] === "0") start++;
  return acc.slice(start);
}
