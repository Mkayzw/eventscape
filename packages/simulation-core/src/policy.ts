import type { Xoshiro256StarStar } from "./rng";
import type { EventState } from "./types";

export interface RankedEvent {
  readonly eventIndex: number;
  readonly score: number;
  readonly popularityFactor: number;
}

export function rankByPopularity(
  candidateEventIndices: readonly number[],
  events: readonly EventState[],
  tieBreaker: Xoshiro256StarStar,
): RankedEvent[] {
  if (candidateEventIndices.length === 0) {
    return [];
  }

  const candidates = candidateEventIndices.map((eventIndex) => {
    const event = events[eventIndex];
    if (!event) {
      throw new RangeError(`Unknown event index ${eventIndex}`);
    }
    return { eventIndex, popularity: event.popularity };
  });
  const maximumPopularity = Math.max(
    1,
    ...candidates.map(({ popularity }) => popularity),
  );
  const priorities = new Map<number, number>();
  const eventsByPopularity = new Map<number, number[]>();
  for (const candidate of candidates) {
    const eventIndices = eventsByPopularity.get(candidate.popularity) ?? [];
    eventIndices.push(candidate.eventIndex);
    eventsByPopularity.set(candidate.popularity, eventIndices);
  }
  for (const eventIndices of eventsByPopularity.values()) {
    if (eventIndices.length < 2) {
      continue;
    }
    for (const eventIndex of [...eventIndices].sort(
      (left, right) => left - right,
    )) {
      priorities.set(eventIndex, tieBreaker.nextFloat());
    }
  }

  return candidates
    .map(({ eventIndex, popularity }) => ({
      eventIndex,
      score: popularity / maximumPopularity,
      popularityFactor: popularity / maximumPopularity,
    }))
    .sort((left, right) => {
      const scoreOrder = right.score - left.score;
      if (scoreOrder !== 0) {
        return scoreOrder;
      }
      const leftPriority = priorities.get(left.eventIndex);
      const rightPriority = priorities.get(right.eventIndex);
      if (leftPriority === undefined || rightPriority === undefined) {
        throw new Error("Missing deterministic priority for tied events");
      }
      return leftPriority - rightPriority || left.eventIndex - right.eventIndex;
    });
}
