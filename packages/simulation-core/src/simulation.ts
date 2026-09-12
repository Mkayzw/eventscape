import { scientificFingerprint } from "./canonical";
import { computeTerminalMetrics } from "./metrics";
import { rankByPopularity } from "./policy";
import { NamedRandomStreams } from "./rng";
import type {
  AgentEventReference,
  EventState,
  SimulationConfiguration,
  SimulationInput,
  SimulationResult,
  TieState,
} from "./types";

function assertProbability(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${name} must be between 0 and 1`);
  }
}

function assertFinite(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be finite`);
  }
}

function assertUnique(values: readonly string[], name: string): void {
  if (new Set(values).size !== values.length) {
    throw new RangeError(`${name} must be unique`);
  }
}

function validateConfiguration(configuration: SimulationConfiguration): void {
  if (configuration.schemaVersion !== "1.0.0") {
    throw new RangeError("schemaVersion must be 1.0.0");
  }
  if (configuration.timestepCount !== 1) {
    throw new RangeError("timestepCount must be 1 in the first slice");
  }
  if (configuration.recommendationListLength !== 1) {
    throw new RangeError(
      "recommendationListLength must be 1 in the first slice",
    );
  }
  assertProbability(
    configuration.tieFormationProbability,
    "tieFormationProbability",
  );
  assertFinite(configuration.tieIncrement, "tieIncrement");
  assertFinite(configuration.maximumTieWeight, "maximumTieWeight");
  assertFinite(configuration.attendanceIntercept, "attendanceIntercept");
  assertFinite(
    configuration.attendanceQualityCoefficient,
    "attendanceQualityCoefficient",
  );
  if (configuration.agents.length === 0) {
    throw new RangeError("at least one agent is required");
  }
  if (configuration.events.length === 0) {
    throw new RangeError("at least one event is required");
  }
  if (configuration.tieIncrement <= 0 || configuration.maximumTieWeight <= 0) {
    throw new RangeError("tie weights must be positive");
  }
  assertUnique(
    configuration.agents.map(({ id }) => id),
    "agent IDs",
  );
  assertUnique(
    configuration.events.map(({ id }) => id),
    "event IDs",
  );
  for (const agent of configuration.agents) {
    if (!Number.isSafeInteger(agent.group) || agent.group < 0) {
      throw new RangeError(
        `agent ${agent.id} group must be a nonnegative safe integer`,
      );
    }
    assertFinite(agent.attendanceBias, `agent ${agent.id} attendanceBias`);
    for (const affinity of agent.topicAffinities ?? []) {
      assertProbability(affinity, `agent ${agent.id} topic affinity`);
    }
  }
  for (const event of configuration.events) {
    if (
      !Number.isSafeInteger(event.capacity) ||
      event.capacity < 0 ||
      !Number.isSafeInteger(event.popularity) ||
      event.popularity < 0
    ) {
      throw new RangeError(
        `event ${event.id} has invalid capacity or popularity`,
      );
    }
    assertProbability(event.quality, `event ${event.id} quality`);
  }
  const tieKeys = new Set<string>();
  for (const tie of configuration.initialTies) {
    if (
      !Number.isSafeInteger(tie.leftAgentIndex) ||
      !Number.isSafeInteger(tie.rightAgentIndex) ||
      tie.leftAgentIndex < 0 ||
      tie.rightAgentIndex < 0 ||
      tie.leftAgentIndex >= configuration.agents.length ||
      tie.rightAgentIndex >= configuration.agents.length
    ) {
      throw new RangeError("tie agent index is outside the agent population");
    }
    if (tie.leftAgentIndex === tie.rightAgentIndex) {
      throw new RangeError("self-ties are not allowed");
    }
    assertFinite(tie.weight, "tie weight");
    if (tie.weight <= 0 || tie.weight > configuration.maximumTieWeight) {
      throw new RangeError("tie weight is outside the configured bounds");
    }
    const key = tieKey(tie.leftAgentIndex, tie.rightAgentIndex);
    if (tieKeys.has(key)) {
      throw new RangeError(`duplicate tie ${key}`);
    }
    tieKeys.add(key);
  }
}

function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

function tieKey(leftAgentIndex: number, rightAgentIndex: number): string {
  return `${Math.min(leftAgentIndex, rightAgentIndex)}:${Math.max(leftAgentIndex, rightAgentIndex)}`;
}

export function runSimulation(input: SimulationInput): SimulationResult {
  validateConfiguration(input.configuration);
  const configuration = input.configuration;
  const streams = new NamedRandomStreams(input.seed);
  const exposures: AgentEventReference[] = [];
  const intentsByEvent = new Map<number, number[]>();
  const eligibleAgentIndices: number[] = [];

  configuration.agents.forEach((agent, agentIndex) => {
    if (!agent.isAvailable) {
      return;
    }
    const candidates = configuration.events
      .map((event, eventIndex) => ({ event, eventIndex }))
      .filter(({ event }) => event.isActive && event.capacity > 0)
      .map(({ eventIndex }) => eventIndex);
    if (candidates.length === 0) {
      return;
    }
    eligibleAgentIndices.push(agentIndex);
    const selected = rankByPopularity(
      candidates,
      configuration.events,
      streams.stream("recommendation-tie-breaking"),
    ).slice(0, configuration.recommendationListLength);
    for (const { eventIndex } of selected) {
      exposures.push({ agentIndex, eventIndex });
    }
    const displayed = selected[0];
    if (!displayed) {
      return;
    }
    const event = configuration.events[displayed.eventIndex];
    if (!event) {
      throw new RangeError(`Unknown selected event ${displayed.eventIndex}`);
    }
    const probability = sigmoid(
      configuration.attendanceIntercept +
        configuration.attendanceQualityCoefficient * event.quality +
        agent.attendanceBias,
    );
    if (streams.stream("attendance").nextFloat() < probability) {
      const intents = intentsByEvent.get(displayed.eventIndex) ?? [];
      intents.push(agentIndex);
      intentsByEvent.set(displayed.eventIndex, intents);
    }
  });

  const attendance: AgentEventReference[] = [];
  for (const [eventIndex, intendingAgentIndices] of [
    ...intentsByEvent.entries(),
  ].sort(([left], [right]) => left - right)) {
    const event = configuration.events[eventIndex];
    if (!event) {
      throw new RangeError(`Unknown event ${eventIndex}`);
    }
    if (intendingAgentIndices.length <= event.capacity) {
      attendance.push(
        ...[...intendingAgentIndices]
          .sort((left, right) => left - right)
          .map((agentIndex) => ({ agentIndex, eventIndex })),
      );
    } else {
      const winners = intendingAgentIndices
        .map((agentIndex) => ({
          agentIndex,
          priority: streams.stream("capacity-resolution").nextFloat(),
        }))
        .sort(
          (left, right) =>
            left.priority - right.priority ||
            left.agentIndex - right.agentIndex,
        )
        .slice(0, event.capacity);
      attendance.push(
        ...winners.map(({ agentIndex }) => ({ agentIndex, eventIndex })),
      );
    }
  }
  attendance.sort(
    (left, right) =>
      left.eventIndex - right.eventIndex || left.agentIndex - right.agentIndex,
  );

  const attendanceCounts = new Map<number, number>();
  for (const { eventIndex } of attendance) {
    attendanceCounts.set(
      eventIndex,
      (attendanceCounts.get(eventIndex) ?? 0) + 1,
    );
  }
  const events: EventState[] = configuration.events.map(
    (event, eventIndex) => ({
      ...event,
      popularity: event.popularity + (attendanceCounts.get(eventIndex) ?? 0),
    }),
  );

  const ties = new Map<string, TieState>();
  for (const tie of configuration.initialTies) {
    ties.set(tieKey(tie.leftAgentIndex, tie.rightAgentIndex), tie);
  }
  const newTieKeys: string[] = [];
  for (const eventIndex of [...attendanceCounts.keys()].sort(
    (left, right) => left - right,
  )) {
    const attendeeIndices = attendance
      .filter((reference) => reference.eventIndex === eventIndex)
      .map((reference) => reference.agentIndex);
    for (let left = 0; left < attendeeIndices.length; left += 1) {
      for (let right = left + 1; right < attendeeIndices.length; right += 1) {
        const leftAgentIndex = attendeeIndices[left];
        const rightAgentIndex = attendeeIndices[right];
        if (leftAgentIndex === undefined || rightAgentIndex === undefined) {
          throw new Error("Attendance pair index is missing");
        }
        if (
          streams.stream("tie-formation").nextFloat() >=
          configuration.tieFormationProbability
        ) {
          continue;
        }
        const key = tieKey(leftAgentIndex, rightAgentIndex);
        const existing = ties.get(key);
        if (!existing) {
          newTieKeys.push(key);
        }
        ties.set(key, {
          leftAgentIndex: Math.min(leftAgentIndex, rightAgentIndex),
          rightAgentIndex: Math.max(leftAgentIndex, rightAgentIndex),
          weight: Math.min(
            configuration.maximumTieWeight,
            (existing?.weight ?? 0) + configuration.tieIncrement,
          ),
        });
      }
    }
  }

  const state = {
    timestep: 1,
    agents: configuration.agents,
    events,
    exposures,
    attendance,
    ties: [...ties.values()].sort(
      (left, right) =>
        left.leftAgentIndex - right.leftAgentIndex ||
        left.rightAgentIndex - right.rightAgentIndex,
    ),
    newTieKeys: newTieKeys.sort(),
    eligibleAgentIndices,
  } as const;
  const manifestInput = {
    model: input.model,
    policy: input.policy,
    configuration: input.configuration,
    seed: input.seed,
  };

  return {
    manifest: {
      manifestVersion: "1.0.0",
      scientificFingerprint: scientificFingerprint(manifestInput),
      ...manifestInput,
    },
    state,
    metrics: computeTerminalMetrics(state),
  };
}
