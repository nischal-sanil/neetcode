// Readable value formatting for the test panel — turn JSON-serializable
// values into compact, legible strings instead of a raw wall of JSON.

export function formatValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    // One-line for flat, short arrays; otherwise pretty over multiple lines.
    const flat = value.every((v) => v === null || typeof v !== "object");
    const oneLine = `[${value.map(formatValue).join(", ")}]`;
    if (flat && oneLine.length <= 60) return oneLine;
    if (oneLine.length <= 48) return oneLine;
    return pretty(value);
  }

  return pretty(value);
}

/** Format the ordered argument list of a single test case. */
export function formatArgs(args: unknown[]): string {
  return args.map(formatValue).join(", ");
}

function pretty(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
