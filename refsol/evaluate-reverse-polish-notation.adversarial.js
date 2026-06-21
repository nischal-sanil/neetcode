const OPS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => Math.trunc(a / b),
};

export function evalRPN(tokens) {
  const stack = [];
  for (const tok of tokens) {
    const op = OPS[tok];
    if (op !== undefined && tok.length === 1) {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(op(a, b));
    } else {
      stack.push(Number.parseInt(tok, 10));
    }
  }
  return stack.pop();
}
