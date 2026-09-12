import { describe, expect, test } from "bun:test";
import { NamedRandomStreams } from "./rng";
import { rankByPopularity } from "./policy";
import type { EventState } from "./types";

const events: readonly EventState[] = [
  {
    id: "e0",
    organizerId: "o0",
    isActive: true,
    capacity: 2,
    popularity: 3,
    quality: 0.8,
  },
  {
    id: "e1",
    organizerId: "o1",
    isActive: true,
    capacity: 2,
    popularity: 1,
    quality: 0.8,
  },
];

describe("rankByPopularity", () => {
  test("orders feasible events by normalized current popularity", () => {
    const ranked = rankByPopularity(
      [0, 1],
      events,
      new NamedRandomStreams("1").stream("recommendation-tie-breaking"),
    );

    expect(ranked.map(({ eventIndex }) => eventIndex)).toEqual([0, 1]);
    expect(ranked.map(({ score }) => score)).toEqual([1, 1 / 3]);
  });

  test("uses deterministic random priorities for equal scores", () => {
    const tied = events.map((event) => ({ ...event, popularity: 1 }));
    const first = rankByPopularity(
      [0, 1],
      tied,
      new NamedRandomStreams("7").stream("recommendation-tie-breaking"),
    );
    const second = rankByPopularity(
      [0, 1],
      tied,
      new NamedRandomStreams("7").stream("recommendation-tie-breaking"),
    );

    expect(first).toEqual(second);
    expect(first.map(({ eventIndex }) => eventIndex)).toEqual([0, 1]);
  });

  test("returns an empty ranking without candidates", () => {
    expect(
      rankByPopularity(
        [],
        events,
        new NamedRandomStreams("1").stream("recommendation-tie-breaking"),
      ),
    ).toEqual([]);
  });
});
