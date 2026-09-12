import { scientificFingerprint } from "./canonical";
import { NamedRandomStreams } from "./rng";

export const POLICY_IDS = [
  "popularity",
  "relevance",
  "social",
  "bridge-aware",
] as const;
export type PolicyId = (typeof POLICY_IDS)[number];

export interface ResearchScenario {
  readonly id: string;
  readonly name: string;
  readonly agentCount: number;
  readonly eventCount: number;
  readonly timesteps: number;
  readonly recommendationListLength: number;
  readonly homophily: number;
  readonly exploration: number;
  readonly socialInfluence: number;
  readonly bridgeWeight: number;
  readonly capacity: number;
}

export interface TimelinePoint {
  readonly timestep: number;
  readonly attendanceRate: number;
  readonly meanRelevance: number;
  readonly exposureGini: number;
  readonly sameGroupEdgeShare: number;
  readonly crossGroupTieRate: number | null;
  readonly catalogCoverage: number;
}

export interface PolicyRun {
  readonly policy: PolicyId;
  readonly seed: string;
  readonly fingerprint: string;
  readonly timeline: readonly TimelinePoint[];
  readonly terminal: TimelinePoint;
}

export interface PolicySummary {
  readonly policy: PolicyId;
  readonly replicationCount: number;
  readonly metrics: Record<
    Exclude<keyof TimelinePoint, "timestep">,
    {
      readonly mean: number | null;
      readonly lower95: number | null;
      readonly upper95: number | null;
      readonly validReplicationCount: number;
    }
  >;
}

export interface ComparativeExperiment {
  readonly schemaVersion: "1.0.0";
  readonly classification: "EXPLORATORY_DEMONSTRATION";
  readonly generatedAt: string;
  readonly scenario: ResearchScenario;
  readonly seeds: readonly string[];
  readonly runs: readonly PolicyRun[];
  readonly summaries: readonly PolicySummary[];
  readonly caveat: string;
}

interface Agent {
  group: number;
  interests: number[];
  exploration: number;
}

interface Event {
  organizer: number;
  affinity: number;
  quality: number;
  popularity: number;
  capacity: number;
}

interface Edge {
  left: number;
  right: number;
  weight: number;
}

export const canonicalResearchScenario: ResearchScenario = {
  id: "balanced-city-v1",
  name: "Balanced city — moderate homophily",
  agentCount: 80,
  eventCount: 16,
  timesteps: 24,
  recommendationListLength: 3,
  homophily: 0.65,
  exploration: 0.18,
  socialInfluence: 0.35,
  bridgeWeight: 0.3,
  capacity: 18,
};

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

function pairKey(left: number, right: number): string {
  return `${Math.min(left, right)}:${Math.max(left, right)}`;
}

function gini(values: readonly number[]): number {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const weighted = sorted.reduce(
    (sum, value, index) => sum + (index + 1) * value,
    0,
  );
  return (
    (2 * weighted) / (sorted.length * total) -
    (sorted.length + 1) / sorted.length
  );
}

function initialize(
  seed: string,
  scenario: ResearchScenario,
): { agents: Agent[]; events: Event[]; edges: Map<string, Edge> } {
  const streams = new NamedRandomStreams(seed);
  const population = streams.stream("experiment-population");
  const network = streams.stream("experiment-network");
  const agents = Array.from({ length: scenario.agentCount }, (_, index) => {
    const group = index % 2;
    return {
      group,
      interests: [
        clamp(0.72 + (population.nextFloat() - 0.5) * 0.35),
        clamp(0.72 + (population.nextFloat() - 0.5) * 0.35),
      ],
      exploration: clamp(
        scenario.exploration + (population.nextFloat() - 0.5) * 0.12,
      ),
    };
  });
  const events = Array.from({ length: scenario.eventCount }, (_, index) => ({
    organizer: index,
    affinity: index % 2,
    quality: 0.55 + population.nextFloat() * 0.4,
    popularity: 1 + (index % 5),
    capacity: scenario.capacity,
  }));
  const edges = new Map<string, Edge>();
  for (let left = 0; left < agents.length; left += 1) {
    for (let right = left + 1; right < agents.length; right += 1) {
      const sameGroup = agents[left]!.group === agents[right]!.group;
      const probability = sameGroup
        ? 0.035 + scenario.homophily * 0.08
        : 0.035 * (1 - scenario.homophily);
      if (network.nextFloat() < probability)
        edges.set(pairKey(left, right), { left, right, weight: 0.2 });
    }
  }
  return { agents, events, edges };
}

function socialSignal(
  agentIndex: number,
  eventAffinity: number,
  agents: readonly Agent[],
  edges: Map<string, Edge>,
): number {
  let signal = 0;
  let weight = 0;
  for (const edge of edges.values()) {
    if (edge.left !== agentIndex && edge.right !== agentIndex) continue;
    const neighbor = edge.left === agentIndex ? edge.right : edge.left;
    signal +=
      (agents[neighbor]!.group === eventAffinity ? 1 : 0.2) * edge.weight;
    weight += edge.weight;
  }
  return weight === 0 ? 0 : signal / weight;
}

function mixedAttendancePotential(
  event: Event,
  agents: readonly Agent[],
): number {
  const expectedByGroup = [0, 1].map((group) => {
    const groupAgents = agents.filter((agent) => agent.group === group);
    return groupAgents.reduce(
      (sum, agent) =>
        sum +
        sigmoid(
          -1.15 + 2.25 * agent.interests[event.affinity]! * event.quality,
        ),
      0,
    );
  });
  const total = expectedByGroup[0]! + expectedByGroup[1]!;
  return total === 0
    ? 0
    : (2 * Math.min(expectedByGroup[0]!, expectedByGroup[1]!)) / total;
}

function score(
  policy: PolicyId,
  agentIndex: number,
  eventIndex: number,
  event: Event,
  events: readonly Event[],
  agents: readonly Agent[],
  edges: Map<string, Edge>,
  scenario: ResearchScenario,
  bridgePotentials: readonly number[],
): number {
  const agent = agents[agentIndex]!;
  const relevance = agent.interests[event.affinity]! * event.quality;
  const maximumPopularity = Math.max(
    ...events.map((candidate) => candidate.popularity),
    1,
  );
  const popularity = event.popularity / maximumPopularity;
  const social = socialSignal(agentIndex, event.affinity, agents, edges);
  const bridge = bridgePotentials[eventIndex]!;
  const organizerCoverage = 1 / (1 + event.popularity);
  switch (policy) {
    case "popularity":
      return popularity;
    case "relevance":
      return relevance;
    case "social":
      return relevance + scenario.socialInfluence * social;
    case "bridge-aware":
      return (
        relevance +
        scenario.bridgeWeight * bridge +
        0.12 * organizerCoverage -
        0.08 * popularity
      );
  }
}

function runPolicy(
  policy: PolicyId,
  seed: string,
  scenario: ResearchScenario,
): PolicyRun {
  const { agents, events, edges } = initialize(seed, scenario);
  const streams = new NamedRandomStreams(seed);
  const choice = streams.stream(`choice:${policy}`);
  const capacity = streams.stream(`capacity:${policy}`);
  const tieFormation = streams.stream(`ties:${policy}`);
  const organizerExposure = Array.from({ length: events.length }, () => 0);
  const exposedEvents = new Set<number>();
  const timeline: TimelinePoint[] = [];
  const bridgePotentials = events.map((event) =>
    mixedAttendancePotential(event, agents),
  );

  for (let timestep = 1; timestep <= scenario.timesteps; timestep += 1) {
    const recommendations: number[][] = [];
    const selections: number[] = [];
    const relevanceByAgent: number[] = [];
    for (let agentIndex = 0; agentIndex < agents.length; agentIndex += 1) {
      const ranked = events
        .map((event, eventIndex) => ({
          eventIndex,
          score: score(
            policy,
            agentIndex,
            eventIndex,
            event,
            events,
            agents,
            edges,
            scenario,
            bridgePotentials,
          ),
        }))
        .sort((a, b) => b.score - a.score || a.eventIndex - b.eventIndex)
        .slice(0, scenario.recommendationListLength)
        .map(({ eventIndex }) => eventIndex);
      recommendations.push(ranked);
      for (const eventIndex of ranked) {
        organizerExposure[events[eventIndex]!.organizer]! += 1;
        exposedEvents.add(eventIndex);
      }
      const selected =
        choice.nextFloat() < agents[agentIndex]!.exploration
          ? ranked[choice.nextInt(ranked.length)]!
          : ranked[0]!;
      selections.push(selected);
      relevanceByAgent.push(
        agents[agentIndex]!.interests[events[selected]!.affinity]! *
          events[selected]!.quality,
      );
    }

    const intents = new Map<number, number[]>();
    for (let agentIndex = 0; agentIndex < agents.length; agentIndex += 1) {
      const selected = selections[agentIndex]!;
      const event = events[selected]!;
      const relevance =
        agents[agentIndex]!.interests[event.affinity]! * event.quality;
      if (choice.nextFloat() < sigmoid(-1.15 + 2.25 * relevance)) {
        const attendees = intents.get(selected) ?? [];
        attendees.push(agentIndex);
        intents.set(selected, attendees);
      }
    }

    const attendance = new Map<number, number[]>();
    for (const [eventIndex, intending] of intents) {
      const accepted =
        intending.length <= events[eventIndex]!.capacity
          ? [...intending]
          : intending
              .map((agentIndex) => ({
                agentIndex,
                priority: capacity.nextFloat(),
              }))
              .sort(
                (a, b) =>
                  a.priority - b.priority || a.agentIndex - b.agentIndex,
              )
              .slice(0, events[eventIndex]!.capacity)
              .map(({ agentIndex }) => agentIndex);
      attendance.set(eventIndex, accepted);
      events[eventIndex]!.popularity += accepted.length;
    }

    let newEdges = 0;
    let newCrossGroupEdges = 0;
    for (const attendees of attendance.values()) {
      for (let left = 0; left < attendees.length; left += 1) {
        for (let right = left + 1; right < attendees.length; right += 1) {
          if (tieFormation.nextFloat() >= 0.07) continue;
          const leftAgent = attendees[left]!;
          const rightAgent = attendees[right]!;
          const key = pairKey(leftAgent, rightAgent);
          const existing = edges.get(key);
          if (!existing) {
            newEdges += 1;
            if (agents[leftAgent]!.group !== agents[rightAgent]!.group)
              newCrossGroupEdges += 1;
          }
          edges.set(key, {
            left: Math.min(leftAgent, rightAgent),
            right: Math.max(leftAgent, rightAgent),
            weight: clamp((existing?.weight ?? 0) + 0.12),
          });
        }
      }
    }

    const finalAttendance = [...attendance.values()].reduce(
      (sum, attendees) => sum + attendees.length,
      0,
    );
    const totalEdgeWeight = [...edges.values()].reduce(
      (sum, edge) => sum + edge.weight,
      0,
    );
    const sameGroupWeight = [...edges.values()]
      .filter((edge) => agents[edge.left]!.group === agents[edge.right]!.group)
      .reduce((sum, edge) => sum + edge.weight, 0);
    timeline.push({
      timestep,
      attendanceRate: finalAttendance / agents.length,
      meanRelevance:
        relevanceByAgent.reduce((sum, value) => sum + value, 0) /
        relevanceByAgent.length,
      exposureGini: gini(organizerExposure),
      sameGroupEdgeShare:
        totalEdgeWeight === 0 ? 0 : sameGroupWeight / totalEdgeWeight,
      crossGroupTieRate: newEdges === 0 ? null : newCrossGroupEdges / newEdges,
      catalogCoverage: exposedEvents.size / events.length,
    });
  }

  const terminal = timeline.at(-1)!;
  return {
    policy,
    seed,
    fingerprint: scientificFingerprint({
      model: "comparative-demo-v1",
      policy,
      scenario,
      seed,
    }),
    timeline,
    terminal,
  };
}

function summarize(runs: readonly PolicyRun[]): PolicySummary[] {
  const metricNames: readonly Exclude<keyof TimelinePoint, "timestep">[] = [
    "attendanceRate",
    "meanRelevance",
    "exposureGini",
    "sameGroupEdgeShare",
    "crossGroupTieRate",
    "catalogCoverage",
  ];
  return POLICY_IDS.map((policy) => {
    const policyRuns = runs.filter((run) => run.policy === policy);
    const metrics = Object.fromEntries(
      metricNames.map((metric) => {
        const values = policyRuns
          .map((run) => run.terminal[metric])
          .filter((value): value is number => value !== null);
        if (values.length === 0) {
          return [
            metric,
            {
              mean: null,
              lower95: null,
              upper95: null,
              validReplicationCount: 0,
            },
          ];
        }
        const mean =
          values.reduce((sum, value) => sum + value, 0) / values.length;
        const variance =
          values.length < 2
            ? 0
            : values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
              (values.length - 1);
        const margin = 1.96 * Math.sqrt(variance / values.length);
        return [
          metric,
          {
            mean,
            lower95: clamp(mean - margin),
            upper95: clamp(mean + margin),
            validReplicationCount: values.length,
          },
        ];
      }),
    ) as PolicySummary["metrics"];
    return { policy, replicationCount: policyRuns.length, metrics };
  });
}

export function runComparativeExperiment(
  scenario: ResearchScenario = canonicalResearchScenario,
  seeds: readonly string[] = [
    "101",
    "202",
    "303",
    "404",
    "505",
    "606",
    "707",
    "808",
  ],
): ComparativeExperiment {
  if (scenario.agentCount < 4 || scenario.agentCount > 500)
    throw new RangeError("agentCount must be between 4 and 500");
  if (scenario.eventCount < 4 || scenario.eventCount > 100)
    throw new RangeError("eventCount must be between 4 and 100");
  if (scenario.timesteps < 1 || scenario.timesteps > 200)
    throw new RangeError("timesteps must be between 1 and 200");
  if (seeds.length < 1 || seeds.length > 100)
    throw new RangeError("seed count must be between 1 and 100");
  const runs = seeds.flatMap((seed) =>
    POLICY_IDS.map((policy) => runPolicy(policy, seed, scenario)),
  );
  return {
    schemaVersion: "1.0.0",
    classification: "EXPLORATORY_DEMONSTRATION",
    generatedAt: "2026-09-12T00:00:00.000Z",
    scenario,
    seeds: [...seeds],
    runs,
    summaries: summarize(runs),
    caveat:
      "Synthetic, exploratory demonstration. These outputs validate platform behavior and illustrate hypotheses; they are not confirmatory empirical findings.",
  };
}
