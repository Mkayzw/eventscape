import { createHash } from "node:crypto";

export type JsonPrimitive = boolean | null | number | string;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { readonly [key: string]: JsonValue };

function normalize(value: unknown, path: string): JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError(`Non-finite number at ${path}`);
    }
    return Object.is(value, -0) ? 0 : value;
  }

  if (Array.isArray(value)) {
    const result: JsonValue[] = [];
    for (let index = 0; index < value.length; index += 1) {
      if (!(index in value)) {
        throw new TypeError(`Sparse array at ${path}[${index}]`);
      }
      result.push(normalize(value[index], `${path}[${index}]`));
    }
    return result;
  }

  if (typeof value === "object") {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new TypeError(`Unsupported object at ${path}`);
    }

    const entries = Object.entries(value as Record<string, unknown>).sort(
      ([left], [right]) => (left < right ? -1 : left > right ? 1 : 0),
    );
    const result: Record<string, JsonValue> = {};
    for (const [key, item] of entries) {
      result[key] = normalize(item, `${path}.${key}`);
    }
    return result;
  }

  throw new TypeError(`Unsupported value at ${path}`);
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(normalize(value, "$"));
}

export function scientificFingerprint(value: unknown): string {
  const digest = createHash("sha256")
    .update(canonicalJson(value), "utf8")
    .digest("hex");
  return `sha256:${digest}`;
}
