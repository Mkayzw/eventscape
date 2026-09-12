import { describe, expect, test } from "bun:test";
import { NamedRandomStreams } from "./rng";

describe("NamedRandomStreams", () => {
  test("matches the v1 golden uint64 vectors", () => {
    const expected = {
      attendance: [
        "2759515010966171865",
        "8902816524519934798",
        "17379101130951610215",
        "195780974905105515",
      ],
      "capacity-resolution": [
        "9342228465298062030",
        "15445131283807962838",
        "6988759645368991894",
        "1764617711863002921",
      ],
      "recommendation-tie-breaking": [
        "10500897975691411295",
        "12231745553592074314",
        "10851003416043803041",
        "2795900082436493725",
      ],
      "tie-formation": [
        "17574387000402795134",
        "15466274564457634913",
        "9482478515193524199",
        "3864562709220420392",
      ],
    } as const;

    for (const [name, vector] of Object.entries(expected)) {
      const stream = new NamedRandomStreams("20260912").stream(name);
      expect(
        Array.from({ length: 4 }, () => stream.nextUint64().toString()),
      ).toEqual([...vector]);
    }
  });

  test("repeats a named stream exactly", () => {
    const first = new NamedRandomStreams("20260912");
    const second = new NamedRandomStreams("20260912");

    expect(
      Array.from({ length: 5 }, () => first.stream("attendance").nextFloat()),
    ).toEqual(
      Array.from({ length: 5 }, () => second.stream("attendance").nextFloat()),
    );
  });

  test("isolates random consumption between streams", () => {
    const perturbed = new NamedRandomStreams("20260912");
    const reference = new NamedRandomStreams("20260912");

    perturbed.stream("recommendation-tie-breaking").nextFloat();
    perturbed.stream("recommendation-tie-breaking").nextFloat();

    expect(perturbed.stream("attendance").nextFloat()).toBe(
      reference.stream("attendance").nextFloat(),
    );
  });

  test("produces floats in the half-open unit interval", () => {
    const stream = new NamedRandomStreams("20260912").stream("attendance");
    for (let index = 0; index < 100; index += 1) {
      const sample = stream.nextFloat();
      expect(sample).toBeGreaterThanOrEqual(0);
      expect(sample).toBeLessThan(1);
    }
  });
});
