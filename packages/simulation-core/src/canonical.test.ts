import { describe, expect, test } from "bun:test";
import { canonicalJson, scientificFingerprint } from "./canonical";

describe("canonicalJson", () => {
  test("sorts object keys recursively while preserving array order", () => {
    expect(canonicalJson({ z: 1, a: { y: 2, x: 1 }, items: [3, 1] })).toBe(
      '{"a":{"x":1,"y":2},"items":[3,1],"z":1}',
    );
  });

  test("rejects non-finite and unsupported values", () => {
    expect(() => canonicalJson({ value: Number.NaN })).toThrow();
    expect(() => canonicalJson({ value: undefined })).toThrow();
    expect(() => canonicalJson(Array(1))).toThrow("Sparse array");
  });

  test("orders keys by Unicode code units rather than locale", () => {
    expect(canonicalJson({ ä: 1, z: 2, A: 3 })).toBe('{"A":3,"z":2,"ä":1}');
  });

  test("fingerprints semantically identical key order identically", () => {
    expect(scientificFingerprint({ b: 2, a: 1 })).toBe(
      scientificFingerprint({ a: 1, b: 2 }),
    );
  });
});
